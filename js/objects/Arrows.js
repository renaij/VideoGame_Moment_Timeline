var drawArrows = function(points){
  for (var i = 1; i < points.length; i++)
  {
    var dir = points[i] - points[i-1];//new THREE.Vector3( 1, 2, 0 );

    //normalize the direction vector (convert to vector of length 1)
    dir.normalize();

    var origin = points[i-1];

    var length = origin.distanceTo( points[i] );
    var hex = 0xffff00;

    var arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
    scene.add( arrowHelper );
  }

  return arrowHelper;
}
