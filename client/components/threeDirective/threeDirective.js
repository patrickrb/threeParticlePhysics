'use strict';

angular.module('threeParticlePhysics')
	.directive('threeDirective',function () {
			return {
				restrict: 'E',
				link: function () {

							var options = {
							    framerate:60,
							    G:10,
							    START_SPEED:0,
							    MOVER_COUNT:32,
							    MIN_MASS:500,
							    MAX_MASS:1000,
							    DENSITY:0.9,

							};

							options.RESET = function() {
							    reset();
							};

							// dat GUI
							var gui = new dat.GUI();
							var f = gui.addFolder('Environment');
							f.open();
							//f.add(options, 'framerate', 1, 120);
							f.add(options, 'G', 1, 1000);
							var fMoverCountE = f.add(options, 'MOVER_COUNT', 1, 128);
							fMoverCountE.onFinishChange(function() {
							    // Fires when a controller loses focus.
							    reset();
							});

							f = gui.addFolder('Masses');
							f.open();
							var fMinMassChangeE = f.add(options, 'MIN_MASS', 0.00001,10000.0);

							fMinMassChangeE.onFinishChange(function() {
							   reset();
							});

							var fMaxMassChangeE = f.add(options, 'MAX_MASS', 0.00001,10000.0);
							fMaxMassChangeE.onFinishChange(function() {
							    reset();
							});

							f = gui.addFolder('Start');
							f.open();

							var fDensityE = f.add(options, 'DENSITY', 1e-100,1.0);
							fDensityE.onFinishChange(function() {
							    reset();
							});

							var fSpeedE = f.add(options, 'START_SPEED', 1e-100,100.0);
							fSpeedE.onFinishChange(function() {
							    reset();
							});

							f.add(options, 'RESET');


							//var FPS = 60;
							var MASS_FACTOR = 0.01; // for display of size

							var translate = new THREE.Vector3();

							var movers = [];
							var now;
							var then = Date.now();
							var renderInterval = 1000/parseInt(options.framerate);
							var renderDelta;

							var scene = new THREE.Scene({castShadow:true});
							var camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight,0.1,100000000.0);
							var renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true });
							var controls = new THREE.OrbitControls( camera, renderer.domElement );


							scene.castShadow=true;
							renderer.setSize(window.innerWidth, window.innerHeight);
							renderer.autoClearColor = true;
							document.body.appendChild(renderer.domElement);

							// add subtle ambient lighting
							// directional lighting
							var directionalLight = new THREE.DirectionalLight(0x666666);
							directionalLight.position.set(1000, 1000, 1000);
							directionalLight.castShadow = true;

							var selectionLight = new THREE.PointLight(0xff0000,0);
							selectionLight.castShadow = true;

							reset();

							function draw() {
							    requestAnimationFrame(draw);
							    now = Date.now();
							    renderDelta = now - then;
							    if (renderDelta > renderInterval) {
							        then = now - (renderDelta % renderInterval);
							        render();
							    }
							}

							draw();

							var lastTimeCalled = new Date();
							var totalMass = 0;

							function render() {
							    var moversAliveCount = 0;
							    totalMass = 0;
							    var maximumMass = 0.00;

							    if (movers && movers.length) {
					            for (var i = movers.length-1; i >= 0; i--) {
					                var m = movers[i];
			                    moversAliveCount ++;
			                    totalMass += m.mass;
			                    if (m.mass > maximumMass) { maximumMass = m.mass; }

			                    for (var j =  movers.length-1; j >= 0; j--) {
			                        var a = movers[j];
	                            var distance = m.location.distanceTo(a.location);
	                            var radiusM = Math.pow((m.mass / MASS_FACTOR/MASS_FACTOR / 4* Math.PI), 1/3)/3;
	                            var radiusA = Math.pow((a.mass / MASS_FACTOR/MASS_FACTOR / 4* Math.PI), 1/3)/3;

	                            if (distance < radiusM + radiusA) {
	                                // merge objects
	                                // a.eat(m);
	                            }
	                            else
	                            {
	                               a.attract(m);
	                            }
			                    }
					            }


						        for (var i = movers.length-1; i >= 0; i--) {
						            var m = movers[i];
				                 m.update();
						        }
						    }

							    controls.update();
							    renderer.render(scene, camera);

							    lastTimeCalled = new Date();

							}


							var theta= 0,phi=0;
							var currentRadius = 2000.0;
							setCamera();

							window.onresize = function() {
							    camera.aspect = window.innerWidth / window.innerHeight;
							    camera.updateProjectionMatrix();
							    renderer.setSize(window.innerWidth, window.innerHeight);
							};


							function reset() {
							    if (movers) {
							        for (var i=0;i<movers.length;i=i+1) {
							            scene.remove(movers[i].mesh);
													scene.remove(movers[i].selectionLight);
							            scene.remove(movers[i].line);
							        }
							    }
							    movers = [];
							    translate.x = 0.0;
							    translate.y = 0.0;
							    translate.z = 0.0;

							    // generate N movers with random mass (N = MOVER_COUNT)
							    for (var i=0;i<parseInt(options.MOVER_COUNT);i=i+1) {
							        var mass = random(options.MIN_MASS,options.MAX_MASS);

							        var maxDistance = parseFloat(1000 / options.DENSITY);
							        var maxSpeed = parseFloat(options.START_SPEED);


							        var vel = new THREE.Vector3(random(-maxSpeed,maxSpeed),random(-maxSpeed,maxSpeed),random(-maxSpeed,maxSpeed));
							        //var vel = new THREE.Vector3();
							        var loc = new THREE.Vector3(random(-maxDistance,maxDistance),random(-maxDistance,maxDistance),random(-maxDistance,maxDistance));

							        movers.push(new Mover(mass,vel,loc));
							    }


							}

							function random(min, max) {
							    return Math.random() * (max - min) + min;
							}

							// Mover Class written by:
							// Daniel Shiffman
							// http://natureofcode.com
							/* MOVER CLASS */
							function Mover(m,vel,loc) {
							    this.location = loc,
							    this.velocity = vel,
							    this.acceleration = new THREE.Vector3(0.0,0.0,0.0),
							    this.mass = m,
							    this.c = 0xffffff,
							    this.alive = true;
							    this.geometry = new THREE.BoxGeometry(100,100,100);

							    this.vertices = [];     // PATH OF MOVEMENT

							    this.line = new THREE.Line();       // line to display movement

							    this.color = this.line.material.color;

							    this.basicMaterial =  new THREE.MeshPhongMaterial({
							        color: this.color, specular: this.color, shininess: 10
							    });

							    this.selectionLight = new THREE.PointLight(this.color, 0.1);
							    this.selectionLight.position.copy(this.location);
							    this.mesh = new THREE.Mesh(this.geometry,this.basicMaterial);
							    this.mesh.castShadow = false;
							    this.mesh.receiveShadow = true;


							    this.position = this.location;

							    this.index = movers.length;
							    this.selected = false;

							    scene.add(this.mesh);
							    scene.add(this.selectionLight);

							    this.applyForce = function(force) {
							        if (!this.mass) { this.mass = 1.0; }
							        var f = force.divideScalar(this.mass);
							        this.acceleration.add(f);
							    };
							    this.update = function() {
							        this.velocity.add(this.acceleration);
							        this.location.add(this.velocity);
							        this.acceleration.multiplyScalar(0);

							        this.selectionLight.position.copy(this.location);
							        this.mesh.position.copy(this.location);

							        if (this.vertices.length > 10000) { this.vertices.splice(0,1); }

							        this.vertices.push(this.location.clone());
							    };

							    this.attract = function(m) {   // m => other Mover object
							        var force = new THREE.Vector3().subVectors(this.location,m.location);         // Calculate direction of force
							        var d = force.length();                              // Distance between objects
							        if (d<0) { d*=-1; }
							        //d = constrain(d,5.0,25.0);                        // Limiting the distance to eliminate "extreme" results for very close or very far objects
							        force = force.normalize();                                  // Normalize vector (distance doesn't matter here, we just want this vector for direction)
							        var strength = - (options.G * this.mass * m.mass) / (d * d);      // Calculate gravitional force magnitude
							        force = force.multiplyScalar(strength);
							        this.applyForce(force);
							    };
							}

							function setCamera() {
							    camera.position.x = currentRadius * Math.sin( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
							    camera.position.y = currentRadius * Math.sin( phi * Math.PI / 360 );
							    camera.position.z = currentRadius * Math.cos( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
							    camera.lookAt(new THREE.Vector3(0,0,0));
							    camera.updateMatrix();
							}
				}
			};
		}
	);
