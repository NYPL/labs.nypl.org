(function() {
  var Main;

  Main = (function() {
    function Main(options) {
      var defaults,
        _this = this;
      defaults = {};
      this.options = $.extend(defaults, options);
      this.init();      
    }   
    
    Main.prototype.init = function(){
      this.checkForHashLink();
      this.initNavLinks();
    };
    
    Main.prototype.checkForHashLink = function(){
      if(window.location.hash) {
        var id = window.location.hash.slice(1);
        this.doNavLink(id);
      }
    };
    
    Main.prototype.doNavLink = function(id){
      var body_id = $('body').attr('id');
      $('.col').removeClass('active');
      if ( body_id == id ) {
        $('body').attr('id','home');
        window.location.hash = 'home';
      } else {
        $('body').attr('id', id);
        $('.col.col-'+id).addClass('active');
        window.location.hash = id;
      }
    };
    
    Main.prototype.initNavLinks = function(){
      var that = this;
      $('.nav-link').on('click',function(e){
        e.preventDefault();
        var id = $(this).attr('href').slice(1);
        that.doNavLink(id);      
      });
    };
    
    

    return Main;

  })();

  $(function() {
    return new Main({});
  });

}).call(this);
