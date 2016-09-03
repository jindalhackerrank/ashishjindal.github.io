var ajaxUtility = function(data,cb) {
    $.ajax({
        url: "https://api.github.com/search/repositories",
        data: data,
        "async": true,
	  	"crossDomain": true,
        error: function() {
           cb("error",{});
        },
        dataType: 'jsonp',
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
        <h2>{"Git Code" + count}</h2>
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
                        PubSub.publish('repolist', response.data);
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
              PubSub.publish('repolist', response.data);
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





var Filter = React.createClass({
getInitialState: function() {
    return {
        "XRateLimitRemaining": 0,
        "XRateLimitLimit": 0
    };
},

	componentWillMount: function() {
    this.pubsub_token = PubSub.subscribe('limit', function(topic, data) {
        this.setState(data);
    }.bind(this));
},

	componentWillUnmount: function() {
    PubSub.unsubscribe(this.pubsub_token);
  },
  componentDidMount:function(){
  	 $("#values").val( "*" + "500" + " - *" + "1500" );
  	$( "#slider" ).slider({
  		 range: true,
      min: 500,
      max: 1500,
      values: [ 500, 1500 ],
  change: function( event, ui ) {
  	console.log(ui.value);
  	PubSub.publish('state', { "stateValue": 0, "status": "Loading Data...." });
      var d = {};
      d["q"] = "language:" + $("#tags").val();
      d["sort"] = "star";
      d["order"] = "desc";
      d["stars"] = ui.value;
      ajaxUtility(d, function(state, response) {
          if (state = "success") {
              console.log(response);
              PubSub.publish('state', { "stateValue": 2, "status": "loaded" });
              if (response.data["items"] == undefined)
                  response.data["items"] = [];
              PubSub.publish('repolist', response.data);
              PubSub.publish('total', { "count": response.data.total_count });
              PubSub.publish('limit', { "XRateLimitRemaining": response.meta["X-RateLimit-Remaining"], "XRateLimitLimit": response.meta["X-RateLimit-Limit"] });
              $( "#values" ).val( "*" + ui.values[ 0 ] + " - *" + ui.values[ 1 ] );
          } else {
              PubSub.publish('state', { "stateValue": 0, "status": "There was error processing your query" });
          }
      })
  }
});
  },
  render: function() {
  	var rem , lim;
  	if(this.state.XRateLimitRemaining == 0 && this.state.XRateLimitLimit == 0 )
  		rem = "";
  	else
  		rem = (<div className="limit"><h3>Rate Limit</h3><h2>{this.state.XRateLimitRemaining + " out of " + this.state.XRateLimitLimit }</h2></div>) 
    return (
      <div className="filter col-md-4">
      	<div id="values" ><h3>500 to 1500 stars</h3></div>
        <div id="slider"></div>
        {rem}
      </div>
    );
  }
});


var ListItem = React.createClass({
  render: function() {
    return (
      <li className="list-item">
        <h3>{this.props.data.full_name}</h3>
        <p>{this.props.data.description}</p>
        <p>{this.props.data.language}</p>
        <a href={this.props.data.html_url} target="_blank">Go to repo </a>
      </li>
    );
  }
});



var RepoList = React.createClass({
  getInitialState:function(){
  	return {
  		"items":[],
  		"total_count":0,
  		"status":"Search for Repository by typing in the search bar",
  		"stateValue":0
  	};
  },
  componentWillMount: function() {
    this.pubsub_token = PubSub.subscribe('repolist', function(topic, data) {
      this.setState(data);
    }.bind(this));

    this.pubsub_token1 = PubSub.subscribe('state', function(topic, data) {
      this.setState(data);
    }.bind(this));

  },
  componentWillUnmount: function() {
    PubSub.unsubscribe(this.pubsub_token);
  },
  render: function() {
  	var L = [];
  	var ren;
  	this.state.items.map(function(value,index){
  		L.push((<ListItem data={value} />))
  	});
  	if(this.state.stateValue == 2 && this.state.items.length > 0 ){
  		ren = (<ul className="list">
        {L}
      </ul>);
  	}else if(this.state.stateValue == 0){
  		ren = (<h3>{this.state.status}</h3>);
  	}else{
  		ren = (<h3>{"No repo was found matching this language"}</h3>);
  	}
    return (
     <div>
     {ren}
     </div>
    );
  }
});


var Content = React.createClass({
  render: function() {
    return (
      <div className="content col-md-8">
      	<div className="search-repo">
        	<Search />
        	<RepoList />
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
        		<Filter />
        	</div>
        </div>,
        document.getElementById('sap')
 );
