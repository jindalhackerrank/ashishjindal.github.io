var ajaxUtility = function(url,cb) {
    $.ajax({
        url: url,
        "async": true,
	  	"crossDomain": true,
        error: function() {
           cb("error",{});
        },
        dataType: 'json',
        "headers": {
		    "content-type": "application/json"
		},
        success: function(data) {
            cb("success",data)
        },
        type: 'GET'
    });
}

var Header = React.createClass({
	getInitialState:function(){
		return {
			"count":0
		};
	},
	componentWillMount:function(){
		 this.pubsub_token = PubSub.subscribe('total', function(topic, data) {
	      this.setState(data);
	    }.bind(this));
	},
	componentWillUnmount: function() {
    PubSub.unsubscribe(this.pubsub_token);
  },
  render: function() {
  	var count= "" ;
  	if(this.state.count!=0)
  		count = " ( " + this.state.count + " Repositories found )";
    return (
      <div className="header row">
        <h2>{"One Push" + count}</h2>
      </div>
    );
  }
});

var Search = React.createClass({
  componentDidMount: function() {
    var self = this;
    $.getJSON("https://gist.githubusercontent.com/mayurah/5a4d45d12615d52afc4d1c126e04c796/raw/ccbba9bb09312ae66cf85b037bafc670356cf2c9/languages.json", function(data) {
        $("#tags").autocomplete({
            source: data,
            select: function(e, ui) {
                PubSub.publish('state', { "stateValue": 0, "status": "Loading Data...." });
                var d = {};
                d["q"] = "language:" + ui.item.value;
                d["sort"] = "star";
                d["order"] = "desc";
                ajaxUtility(d, function(state, response) {
                    if (state = "success") {
                        console.log(response);
                        PubSub.publish('state', { "stateValue": 2, "status": "loaded" });
                        if (response.data["items"] == undefined)
                            response.data["items"] = [];
                        PubSub.publish('WebsiteList', response.data);
                        PubSub.publish('total', { "count": response.data.total_count });
                        PubSub.publish('limit', { "XRateLimitRemaining": response.meta["X-RateLimit-Remaining"], "XRateLimitLimit": response.meta["X-RateLimit-Limit"] });
                    } else {
                        PubSub.publish('state', { "stateValue": 0, "status": "There was error processing your query" });
                    }
                })

            }
        });
    });
},

  onclick: function() {
      PubSub.publish('state', { "stateValue": 0, "status": "Loading Data...." });
      var d = {};
      d["q"] = "language:" + $("#tags").val();
      d["sort"] = "star";
      d["order"] = "desc";
      ajaxUtility(d, function(state, response) {
          if (state = "success") {
              console.log(response);
              PubSub.publish('state', { "stateValue": 2, "status": "loaded" });
              if (response.data["items"] == undefined)
                  response.data["items"] = [];
              PubSub.publish('WebsiteList', response.data);
              PubSub.publish('total', { "count": response.data.total_count });
              PubSub.publish('limit', { "XRateLimitRemaining": response.meta["X-RateLimit-Remaining"], "XRateLimitLimit": response.meta["X-RateLimit-Limit"] });
          } else {
              PubSub.publish('state', { "stateValue": 0, "status": "There was error processing your query" });
          }
      })
  },

  render: function() {
    return (
      <div className="search row">
      	<div className="col-md-6 col-xs-8">
        	<input id="tags"  type="text" className="form-control" />
        </div>
        <div className="col-md-2 col-xs-4">
        	<button type="button" className="btn btn-default" onClick={this.onclick}>Search</button>
        </div>
      </div>
    );
  }
});







var ListItem = React.createClass({
  render: function() {
    return (
      <li className="list-item">
        <h3>{this.props.data.title}</h3>
        <img src={this.props.data.favicon_image} className="img-responsive" />
        <p>{this.props.data.tag}</p>
        <a href={this.props.data.url_address} target="_blank">{this.props.data.url_address} </a>
      </li>
    );
  }
});



var WebsiteList = React.createClass({
  getInitialState:function(){
  	return {
  		"websites":[],
  	};
  },
  componentWillMount: function() {
    this.pubsub_token = PubSub.subscribe('WebsiteList', function(topic, data) {
      this.setState(data);
    }.bind(this));

  },
  componentWillUnmount: function() {
    PubSub.unsubscribe(this.pubsub_token);
  },
  render: function() {
  	var L = [];
  	var ren;
  	this.state.websites.map(function(value,index){
  		L.push((<ListItem data={value} />))
  	});
    return (
     <ul className="list">
     {L}
     </ul>
    );
  }
});


var Content = React.createClass({
  componentDidMount:function(){
    ajaxUtility("https://hackerearth.0x10.info/api/one-push?type=json&query=list_websites",function(type,data){
      if(type=="success")
        console.log(data);
        PubSub.publish('WebsiteList',data);
    })
  },
  render: function() {
    return (
      <div className="content col-md-8">
      	<div className="search-repo">
        	<Search />
        	<WebsiteList />
        </div>
      </div>
    );
  }
});



ReactDOM.render(
		<div className="container">
        	<Header />
        	<div className="row main-content">
        		<Content />
        	</div>
        </div>,
        document.getElementById('sap')
 );
