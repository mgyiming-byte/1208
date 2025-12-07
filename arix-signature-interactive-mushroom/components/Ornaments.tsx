import React, { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { CONFIG, ORNAMENT_MATERIAL, BOX_GEOMETRY, SPHERE_GEOMETRY, PALETTE } from '../constants';
import { getMushroomPosition, getRandomScatterPosition } from '../utils/math';
import { AppState } from '../types';

interface OrnamentsProps {
  appState: AppState;
}

const Ornaments: React.FC<OrnamentsProps> = ({ appState }) => {
  const boxRef = useRef<THREE.InstancedMesh>(null);
  const sphereRef = useRef<THREE.InstancedMesh>(null);
  
  const count = CONFIG.ornamentCount; // Total per type

  // Data storage
  const [data] = useState(() => {
    const items = [];
    for (let i = 0; i < count * 2; i++) {
       // Half boxes, half spheres
       const type = i < count ? 'BOX' : 'SPHERE';
       const tPos = getMushroomPosition();
       
       // Push ornaments slightly outside the foliage to be visible
       const center = new THREE.Vector3(0, tPos.y, 0);
       const dir = new THREE.Vector3().subVectors(tPos, center).normalize();
       tPos.add(dir.multiplyScalar(0.8)); // Push out further for visibility

       const sPos = getRandomScatterPosition(CONFIG.scatterRadius * 1.2);
       
       // Pick a random color from palette
       const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];

       items.push({
         type,
         treePos: tPos,
         scatterPos: sPos,
         currentPos: sPos.clone(),
         rotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, 0),
         rotSpeed: (Math.random() - 0.5) * 1.5,
         scale: Math.random() * 0.5 + 0.3,
         color: color, 
       });
    }
    return items;
  });

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  // Initialize Colors once
  useEffect(() => {
    if (boxRef.current && sphereRef.current) {
        let boxIdx = 0;
        let sphereIdx = 0;

        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            if (item.type === 'BOX') {
                boxRef.current.setColorAt(boxIdx, item.color);
                boxIdx++;
            } else {
                sphereRef.current.setColorAt(sphereIdx, item.color);
                sphereIdx++;
            }
        }
        boxRef.current.instanceColor!.needsUpdate = true;
        sphereRef.current.instanceColor!.needsUpdate = true;
    }
  }, [data]);

  useFrame((state, delta) => {
    const isTree = appState === AppState.TREE_SHAPE;
    const time = state.clock.elapsedTime;
    
    // Update Boxes
    if (boxRef.current) {
        let idx = 0;
        for (let i = 0; i < data.length; i++) {
            if (data[i].type !== 'BOX') continue;
            updateInstance(data[i], idx, boxRef.current, isTree, delta, time);
            idx++;
        }
        boxRef.current.instanceMatrix.needsUpdate = true;
    }

    // Update Spheres
    if (sphereRef.current) {
        let idx = 0;
        for (let i = 0; i < data.length; i++) {
            if (data[i].type !== 'SPHERE') continue;
            updateInstance(data[i], idx, sphereRef.current, isTree, delta, time);
            idx++;
        }
        sphereRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  const updateInstance = (
      item: any, 
      index: number, 
      mesh: THREE.InstancedMesh, 
      isTree: boolean, 
      delta: number,
      time: number
  ) => {
    const target = isTree ? item.treePos : item.scatterPos;
    
    // Lerp position
    const speed = CONFIG.transitionSpeed * delta;
    item.currentPos.lerp(target, speed);
    
    // Add floating noise - dreamier movement
    const floatY = Math.sin(time * 0.5 + index) * 0.05;
    
    dummy.position.copy(item.currentPos);
    dummy.position.y += floatY;
    
    // Rotate slowly
    dummy.rotation.x = item.rotation.x + time * item.rotSpeed * 0.3;
    dummy.rotation.y = item.rotation.y + time * item.rotSpeed * 0.3;
    dummy.rotation.z = item.rotation.z + time * item.rotSpeed * 0.1;

    // Pulse scale slightly
    const scalePulse = 1.0 + Math.sin(time * 2 + index) * 0.1;
    dummy.scale.setScalar(item.scale * scalePulse);
    
    dummy.updateMatrix();
    mesh.setMatrixAt(index, dummy.matrix);
  };

  return (
    <group>
      {/* Boxes */}
      <instancedMesh ref={boxRef} args={[BOX_GEOMETRY, ORNAMENT_MATERIAL, count]}>
      </instancedMesh>
      
      {/* Spheres */}
      <instancedMesh ref={sphereRef} args={[SPHERE_GEOMETRY, ORNAMENT_MATERIAL, count]}>
      </instancedMesh>
    </group>
  );
};

export default Ornaments;