import Head from 'next/head';
import React, { useEffect , useState} from "react";
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
///import {Scene} from "three";

import styles from '../styles/Home.module.css'

import * as THREE  from "three"
import Image from 'next/image'



const Layout = (props) => {

  const { useRef, useEffect, useState } = React
  const mount = useRef(null)

  useEffect(() => {
    // vars
    var num=30;
    var objects=[];
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    var light,t,i;
    // create camera
    var camera = new THREE.PerspectiveCamera( 65, window.innerWidth/window.innerHeight, 0.1, 1000 );
    camera.position.set(0.0,0.0,5);
    // create a scene
    var scene = new THREE.Scene();
    // create renderer
    var renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    //Create a Spot light
    light = new THREE.SpotLight( 0xccddff,.8 );
    light.position.set(0,0,5);
    scene.add( light );
    

    // load a ground texture
    var texture = new THREE.TextureLoader().load("/assets/nz.jpg");
   // texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    //texture.repeat.set (12,12);
    // create ground material
    material = new THREE.MeshPhysicalMaterial({map:texture,bumpMap:texture});
    // create ground mesh
    var geometry = new THREE.PlaneBufferGeometry( 100,100 );
    var ground = new THREE.Mesh( geometry, material );
    ground.rotation.z = Math.PI/180 * -45;
    ground.rotation.x = Math.PI/180 * -90;
    ground.position.y=-2.0;
    scene.add(ground);
    // texture
    var texture = new THREE.TextureLoader().load("/assets/rock_01_diffusion.jpg");
    // create environment map
    var envMap = new THREE.CubeTextureLoader().setPath( '/assets/').load( [ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ] );
    
    // create Tetrahedron
    var geometry = new THREE.TetrahedronBufferGeometry(2,0);
    var material = new THREE.MeshPhysicalMaterial( { map:texture,   envMap:envMap, metalness:1.0,roughness:0.0 });
    t = new THREE.Mesh( geometry, material );
    t.rotation.x=Math.PI/180*-10;
    //scene.add( t );
  
    for (i=0;i<=num;i++){
      // create new mesh
      var geometry = new THREE.SphereBufferGeometry( .1,6,6  );
      var material = new THREE.MeshPhysicalMaterial(  ) ;
      // create mesh
      var particle = new THREE.Mesh( geometry, material );
      // set random position
      particle.position.set(Math.random()*100.0 - 50.0,0.0 ,Math.random()* - 10.0 );
      // calc distnace as constant and assign to object
      var a = new THREE.Vector3( 0, 0, 0 );
      var b = particle.position;
      var d = a.distanceTo( b );
      particle.distance = d;
      // define 2 random but constant angles in radians
      particle.radians = Math.random()*360 * Math.PI/180; // initial angle
      particle.radians2 = Math.random()*360 * Math.PI/180; // initial angle
      // add object to scene
      scene.add( particle );	
      // add to collection
      objects.push( particle ); 
    }
  
    var animate = function () {
      requestAnimationFrame( animate );
      t.rotation.y -= 0.005;
      camera.lookAt(t.position);
      
      for (i=0;i<=num;i++){
        var o = objects[i];
        o.rotation.y+=.01;
        if( i % 2 == 0) { 
          o.radians+=.005; o.radians2+=.005;
        } else {
          o.radians-=.005; o.radians2-=.005;
        }
        o.position.x = (Math.cos(o.radians) * o.distance);
        o.position.z = (Math.sin(o.radians) * o.distance);
        o.position.y = (Math.sin(o.radians2) * o.distance*.5);
      }	
      
      renderer.render(scene, camera);
    };
    animate();
  
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    function onDocumentMouseMove( event ) {
      event.preventDefault();
      mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
      mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
      raycaster.setFromCamera( mouse, camera );
      var intersects = raycaster.intersectObjects( objects , true);
      if ( intersects.length > 0 ) {
        active = intersects[ 0 ].object;
        active.material.color.setHex( Math.random() * 0x9999999 );
      }
      t.rotation.z = mouse.x*.5;
      t.rotation.x = mouse.y*.5;
     }
      // === THREE.JS EXAMPLE CODE END ===
      }, [])


    //LAYOUT RENDER
    return ( 
    <div>
        <Head>
          <title>{props.pageTitle}</title>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        </Head>
        <div ref={mount}>
        <h1 >Coming Soon   </h1>
     
         <div className="elevate">  
         <Image src="/assets/logo.png" alt="me" width="164" height="164" />
        <Form>
      <FormGroup className="emailForm">
        <Input type="email" name="email" id="email"  />
        <Button color="primary" className="submitButton">Notify</Button>
      </FormGroup>
      </Form>
        </div>
          {props.children}
        </div>
  </div>
    )
} 
export default Layout;