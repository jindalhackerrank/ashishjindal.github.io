

var ajaxUtility = function(data,cb) {
    data["access_token"] = "3945141046.309ec1f.d475a47f930344ba91170f76b4d7ee55";
    $.ajax({
        url: "https://api.instagram.com/v1/media/search",
        data: data,
        "async": true,
	  	"crossDomain": true,
        error: function() {
          console.log("There was error accesing instagram api due to access token issues");
           cb("error",{});
        },
        dataType: 'jsonp',
        "headers": {
		    "content-type": "application/json"
		},
        success: function(data) {
            var d = [];
            console.log(data.data);
            console.log("successfully fetched data " + JSON.stringify(data.data));
            data.data.map(function(value,index){
              var obj = {};
              obj["id"] = value.id;
              obj["path"] = value["images"]["thumbnail"]["url"];
              d.push(obj);
            })
            cb("success",d);
        },
        type: 'GET'
    });
}


var Img = React.createClass({
  toggle:function(){
    var data = JSON.parse(localStorage.getItem("favImages"));
    var self = this;
    var result = $.grep(data, function(e){ return e.id == self.props.id; });
    if(result.length == 0){
      data.push({"id":this.props.id,"path":this.props.path});
    }else {
    data =   $.grep(data, function(e){
     return e.id != self.props.id;
    });
    }
    localStorage.setItem("favImages",JSON.stringify(data));
    PubSub.publish("updateCount",JSON.stringify(data));
    this.setState({});
  },
  render: function() {
    var isFav;
    var self = this;
    if($.grep(JSON.parse(localStorage.getItem("favImages")), function(e){ return e.id == self.props.id; }).length>0){
      isFav = (<div className="fav">Added to Fav</div>);
    }else{
      isFav = (<div className="fav">Add to Fav</div>);
    }
    return (
      <div className="image" onClick={this.toggle}>
        <img src={this.props.path} className="img-responsive" />
        {isFav}
      </div>
    );
  }
});


var ImageList = React.createClass({
  getInitialState:function(){
    return {
      "images":[]
    }
  },
  componentWillMount:function(){
     this.pubsub_token = PubSub.subscribe('images', function(topic, data) {
        this.setState({"images":data});
      }.bind(this));
  },
  componentWillUnmount: function() {
    PubSub.unsubscribe(this.pubsub_token);
  },
  render: function() {
    var Images = [] ;
    console.log("Inside Image List Api rendring " + this.state.images.length + " images");
    this.state.images.map(function(value,index){
      Images.push((<Img path={value.path} id={value.id} />));
    })
    return (
      <div className="image-list">
      	{Images}
      </div>
    );
  }
});




PubSub.subscribe("newLocation",function(topic,data){
  console.log("Called event newLocation to fetch the data for " + JSON.stringify(data));
  ajaxUtility(data, function(state, response) {
    console.log(response);
    console.log(state);
    if(state=="success"){
      console.log(response);
      PubSub.publish("images",response);
      PubSub.publish("removeFav",response);
    }else{
        console.log("Sending blank array list to ImageList component due to failure in fetch api");
        PubSub.publish("images",[]);
    }
  });
})


var Header =  React.createClass({
  getInitialState:function(){
    return {
      "showFav":true
    }
  },
  componentDidMount:function(){
    if(localStorage.getItem("favImages") == null)
      localStorage.setItem("favImages","[]")
      if(this.state.showFav)
        PubSub.publish("images",JSON.parse(localStorage.getItem("favImages")))
  },
  componentWillMount:function(){
    var self = this;
    this.pubsub_token = PubSub.subscribe("updateCount",function(topic,data){
      self.setState({});
    })
    this.pubsub_token1 = PubSub.subscribe("removeFav",function(topic,data){
      self.setState({"showFav":false});
    })
  },
  componentWillUnmount: function() {
    PubSub.unsubscribe(this.pubsub_token);
    PubSub.unsubscribe(this.pubsub_token1);
  },
  showFav:function(){
      console.log("Loading " + JSON.parse(localStorage.getItem("favImages")).length +  " images inside the session Storage");
      this.state.showFav = !this.state.showFav;
      if(this.state.showFav)
        PubSub.publish("images",JSON.parse(localStorage.getItem("favImages")))
      else
        PubSub.publish("images",[]);
      this.setState({});
  },
  render: function() {
    return (
      <div className={this.state.showFav?"header show-fav":"header"} onClick={this.showFav}>
        {"Favourites : " + (localStorage.getItem("favImages")==null?"0":JSON.parse(localStorage.getItem("favImages")).length)}
      </div>
    );
  }
});


ReactDOM.render(
        <div className="content">
          <Header />
          <ImageList />
        </div>,
        document.getElementById('sap')
 );
