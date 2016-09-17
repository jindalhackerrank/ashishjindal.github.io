

var ajaxUtility = function(data,cb) {
    data["access_token"] = "ACCESS-TOKEN";
    $.ajax({
        url: "https://api.instagram.com/v1/media/search",
        data: data,
        "async": true,
	  	"crossDomain": true,
        error: function() {
          console.log("There was error accesing instagram api due to access token issues");
           cb("error",{});
        },
        dataType: 'json',
        "headers": {
		    "content-type": "application/json"
		},
        success: function(data) {
          console.log("bbb");
            cb("success",data)
        },
        type: 'GET'
    });
}


var Img = React.createClass({
  toggle:function(){
    var data = JSON.parse(sessionStorage.getItem("favImages"));
    if(data[this.props.id] == undefined){
      data[this.props.id] = this,props.path;
    }else {
      delete data[this,props.id];
    }
    sessionStorage.setItem("favImages",JSON.stringify(data));
    PubSub.publish("imageList",{});
    this.setState({});
  },
  render: function() {
    var isFav;
    if(JSON.parse(sessionStorage.getItem("favImages"))[this.props.id]!=undefined){
      isFav = (<span className="fav">Added to Fav</span>);
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
        this.setState(data);
      }.bind(this));
  },
  componentWillUnmount: function() {
    PubSub.unsubscribe(this.pubsub_token);
  },
  render: function() {
    var Images = [] ;
    console.log("Inside Image List Api rendring " + this.state.images.length + " images");
    this.state.images.map(function(value,index){
      Images.push((<Img src={value.path} id={value.id} />));
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
      PubSub.publish("images",response);
    }else{
        console.log("Sending blank array list to ImageList component due to failure in fetch api");
        PubSub.publish("images",[]);
    }
  });
})


var Header =  React.createClass({
  componentDidMount:function(){
    if(sessionStorage.getItem("favImages") == null)
      sessionStorage.setItem("favImages","[]")
  },
  showFav:function(){
      console.log("Loading " + JSON.parse(sessionStorage.getItem("favImages")).length +  " images inside the session Storage");
      PubSub.publish("images",JSON.parse(sessionStorage.getItem("favImages")))
  },
  render: function() {
    return (
      <div className="header" onClick={this.showFav}>
        {"Favourites : " + (sessionStorage.getItem("favImages")==null?"0":JSON.parse(sessionStorage.getItem("favImages")).length)}
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
