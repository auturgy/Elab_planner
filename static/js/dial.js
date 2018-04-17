;(function( $, $w, $d ) {

  var $ks = $('.knob-scroll input'),
        h = function( e ) { return e.height() };

  $w.on('load scroll', function(){
    var d = h( $d ),
        w = h( $w ),
        s = Math.round( $w.scrollTop() / ( d - w ) * 100 );
    $ks.val( s ).trigger('change');
  });

  function knobToScroll( val ) {
    var d = h( $d ), 
        w = h( $w );
    $w.scrollTop( val * ( d - w ) / 100 );
  }

  $ks.knob({
    'thickness' : '.3',
    'fgColor'   : 'rgb(135, 226, 235)',
    'bgColor'   : 'rgb(240, 240, 240)',
    'width'     : '100',
    release : function ( val ) {
      knobToScroll( val );
    }// Show input:
  }).find('input').show();

})( jQuery, jQuery( window ), jQuery( document ) );