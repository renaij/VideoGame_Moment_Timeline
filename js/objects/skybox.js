var addSkybox = function(){
  var uniforms = {
          iResolution: { type: "v2", value: new THREE.Vector2(WIDTH, HEIGHT)},
          time: {type: "float", value: 0.0},
          color1: {type: "v3", value: new THREE.Vector3(1.0,0.9,0.9)}, //(0.8,1.0,1.0)
          color2: {type: "v3", value: new THREE.Vector3(0.9,0.95,1.0)}, //(1.0,1.0,0.9)
  };
  var material = new THREE.RawShaderMaterial( {
      uniforms: uniforms,
      vertexShader: skybox_vertexShader,
      fragmentShader: skybox_fragmentShader
    } );

  material.depthWrite = false;
  material.side = THREE.BackSide;
  //var geometry = new THREE.BoxGeometry( spaceScale*1.2, spaceScale*1.2, spaceScale*1.2 );

  var geometry = new THREE.SphereBufferGeometry(spaceScale );

  skybox = new THREE.Mesh( geometry, material );

  scene.add( skybox );


}
