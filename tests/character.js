import * as THREE from 'three';

/**
 * Creates a Princess Ida-inspired character for Monument Valley style
 * @returns {THREE.Group} Character group positioned at origin
 */
export function createCharacter() {
    const character = new THREE.Group();

    // Better materials - use MeshLambertMaterial for subtle shading
    const whiteMaterial = new THREE.MeshLambertMaterial({
        color: 0xFFFFFF,
        flatShading: true  // Monument Valley style
    });

    // 1. Dress/Body - truncated cone for better silhouette
    // Wider at bottom, narrower at top (more realistic dress shape)
    const dressGeometry = new THREE.CylinderGeometry(0.15, 0.45, 1.0, 8);
    const dress = new THREE.Mesh(dressGeometry, whiteMaterial);
    dress.position.y = 0.5; // Half of dress height
    const dressEdges = new THREE.LineSegments(
        new THREE.EdgesGeometry(dressGeometry),
        new THREE.LineBasicMaterial({ color: 0x000000 })
    );
    dress.add(dressEdges);
    character.add(dress);

    // 2. Neck - tiny cylinder connecting head to body
    const neckGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.15, 6);
    const neck = new THREE.Mesh(neckGeometry, whiteMaterial);
    neck.position.y = 1.075; // Top of dress (1.0) + half neck (0.075)
    const neckEdges = new THREE.LineSegments(
        new THREE.EdgesGeometry(neckGeometry),
        new THREE.LineBasicMaterial({ color: 0x000000 })
    );
    neck.add(neckEdges);
    character.add(neck);

    // 3. Head - sphere for rounder, more appealing shape
    const headGeometry = new THREE.SphereGeometry(0.2, 8, 6);
    const head = new THREE.Mesh(headGeometry, whiteMaterial);
    head.position.y = 1.35; // Top of neck (1.15) + head radius (0.2)
    const headEdges = new THREE.LineSegments(
        new THREE.EdgesGeometry(headGeometry),
        new THREE.LineBasicMaterial({ color: 0x000000 })
    );
    head.add(headEdges);
    character.add(head);

    // 4. Hat Base - cylinder for the base of the hat
    const hatBaseGeometry = new THREE.CylinderGeometry(0.22, 0.22, 0.1, 8);
    const hatBase = new THREE.Mesh(hatBaseGeometry, whiteMaterial);
    hatBase.position.y = 1.5; // On top of head
    const hatBaseEdges = new THREE.LineSegments(
        new THREE.EdgesGeometry(hatBaseGeometry),
        new THREE.LineBasicMaterial({ color: 0x000000 })
    );
    hatBase.add(hatBaseEdges);
    character.add(hatBase);

    // 5. Pointy Hat - taller cone for more distinctive Monument Valley look
    const hatGeometry = new THREE.ConeGeometry(0.2, 0.6, 8);
    const hat = new THREE.Mesh(hatGeometry, whiteMaterial);
    hat.position.y = 1.85; // On top of hat base (1.55) + half hat height (0.3)
    const hatEdges = new THREE.LineSegments(
        new THREE.EdgesGeometry(hatGeometry),
        new THREE.LineBasicMaterial({ color: 0x000000 })
    );
    hat.add(hatEdges);
    character.add(hat);

    // 6. Small feet for grounding
    for (let i = 0; i < 2; i++) {
        const m = i === 0 ? 1 : -1; // Mirror for left/right
        const footGeometry = new THREE.BoxGeometry(0.12, 0.08, 0.18);
        const foot = new THREE.Mesh(footGeometry, whiteMaterial);
        foot.position.set(0.15 * m, 0.04, 0.1);
        const footEdges = new THREE.LineSegments(
            new THREE.EdgesGeometry(footGeometry),
            new THREE.LineBasicMaterial({ color: 0x000000 })
        );
        foot.add(footEdges);
        character.add(foot);
    }

    return character;
}
