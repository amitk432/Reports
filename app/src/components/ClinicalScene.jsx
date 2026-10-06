import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { DIAGRAMS, REGION_COLORS } from "../diagramClinical.js";
import Icon from "./Icon.jsx";

function makeModel(area, process) {
  const group = new THREE.Group();
  const mat = (color, opacity = 1) =>
    new THREE.MeshPhysicalMaterial({
      color,
      roughness: 0.55,
      metalness: 0.05,
      clearcoat: 0.25,
      transparent: opacity < 1,
      opacity,
      depthWrite: opacity === 1,
      side: THREE.DoubleSide,
    });
  const add = (geo, material, pos = [0, 0, 0], scale = [1, 1, 1]) => {
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.set(...pos);
    mesh.scale.set(...scale);
    group.add(mesh);
    return mesh;
  };
  const ball = (pos, scale, material) =>
    add(new THREE.SphereGeometry(1, 40, 28), material, pos, scale);
  const tube = (points, radius, material) =>
    add(
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p))),
        64,
        radius,
        8,
        false,
      ),
      material,
    );
  const tissue = mat("#c3a993", 0.32),
    grooves = mat("#dfc4aa", 0.48),
    fluid = mat("#6ac6d7", 0.7);
  const particles = [],
    targets = [];
  if (process && (area === "brain" || area === "blood")) {
    const wall = add(
      new THREE.CylinderGeometry(0.52, 0.52, 3.8, 48, 1, true),
      mat("#a55f63", 0.28),
    );
    wall.rotation.z = Math.PI / 2;
    for (let i = 0; i < 3; i++) {
      const ring = add(
        new THREE.TorusGeometry(0.52, 0.025, 8, 64),
        mat("#bc8583", 0.6),
        [(i - 1) * 1.8, 0, 0],
      );
      ring.rotation.y = Math.PI / 2;
    }
    if (area === "brain") {
      ball([0.35, 0, 0], [0.42, 0.5, 0.5], mat("#edba69"));
      ball([1.55, 0, 0], [0.3, 0.58, 0.5], mat("#91b1a9", 0.38));
    } else {
      for (let i = 0; i < 5; i++) {
        const bacterium = ball(
          [-0.9 + i * 0.4, 0.16 * Math.sin(i), 0.23],
          [0.11, 0.045, 0.045],
          mat("#f0808c"),
        );
        bacterium.rotation.z = i * 0.8;
      }
    }
    for (let i = 0; i < 16; i++) {
      const p = ball([0, 0, 0], [0.085, 0.055, 0.075], mat("#d67372"));
      particles.push({ mesh: p, offset: i / 16 });
    }
  } else if (area === "brain") {
    for (const s of [-1, 1]) {
      const cortex = ball([s * 0.65, 0.35, 0], [0.66, 1.04, 0.83], tissue);
      const vertices = cortex.geometry.attributes.position;
      for (let i = 0; i < vertices.count; i++) {
        const x = vertices.getX(i),
          y = vertices.getY(i),
          z = vertices.getZ(i);
        const longitude = Math.atan2(z, x),
          latitude = Math.asin(Math.max(-1, Math.min(1, y)));
        const fold =
          1 +
          0.025 *
            Math.sin(latitude * 23 + 2 * Math.sin(longitude * 3)) *
            Math.cos(longitude * 9 + latitude * 2);
        vertices.setXYZ(i, x * fold, y * fold, z * fold);
      }
      cortex.geometry.computeVertexNormals();
      // Cortical ridges wrap around each hemisphere; they are anatomical context, not lesions.
      for (let j = 0; j < 15; j++) {
        const y = -0.48 + j * 0.12,
          points = [];
        for (let k = 0; k <= 36; k++) {
          const angle = (k / 36) * Math.PI * 2,
            f = Math.sqrt(Math.max(0.02, 1 - ((y - 0.35) / 1.04) ** 2));
          points.push([
            s * 0.65 + 0.67 * f * Math.cos(angle),
            y +
              0.06 * Math.sin(angle * 3 + j * 0.8) +
              0.025 * Math.cos(angle * 7 - j),
            0.84 * f * Math.sin(angle),
          ]);
        }
        tube(points, 0.018, grooves);
      }
      ball([s * 0.44, -0.93, -0.26], [0.46, 0.36, 0.43], mat("#b6aaa0", 0.5));
      for (let j = 0; j < 7; j++) {
        const y = -1.18 + j * 0.07,
          pts = [];
        for (let k = 0; k <= 24; k++) {
          const a = (k / 24) * Math.PI * 2;
          pts.push([
            s * 0.44 + 0.44 * Math.cos(a),
            y + 0.02 * Math.sin(a * 3),
            -0.26 + 0.37 * Math.sin(a),
          ]);
        }
        tube(pts, 0.013, grooves);
      }
      tube(
        [
          [s * 0.16, 0.67, 0.22],
          [s * 0.3, 0.48, 0.1],
          [s * 0.27, 0.26, -0.23],
          [s * 0.37, 0.13, -0.38],
        ],
        0.065,
        fluid,
      );
      tube(
        [
          [s * 0.07, 0.64, 0.24],
          [s * 0.07, 0.74, 0.04],
          [s * 0.07, 0.55, -0.31],
          [s * 0.07, 0.3, -0.37],
        ],
        0.045,
        mat("#e0d1aa", 0.85),
      );
    }
    ball([0, -0.68, 0.01], [0.17, 0.36, 0.16], tissue);
    ball([0, -0.84, 0.07], [0.21, 0.18, 0.19], tissue);
    ball([0, -0.79, -0.18], [0.075, 0.12, 0.065], fluid);
  } else if (area === "heart") {
    const ring = add(
      new THREE.TorusGeometry(0.95, 0.12, 20, 80),
      mat("#bd8b7f"),
    );
    ring.scale.y = 0.78;
    const leaflet = ball([0, 0.31, 0], [0.82, 0.38, 0.12], mat("#c99b86"));
    leaflet.rotation.x = 0.24;
    ball([0, -0.34, 0], [0.78, 0.3, 0.12], mat("#b27d70"));
    for (const s of [-1, 1])
      for (let i = 0; i < 5; i++)
        tube(
          [
            [s * (0.18 + i * 0.12), s * 0.28, 0],
            [s * 0.42, -0.85, -0.1],
            [s * 0.5, -1.25, -0.05],
          ],
          0.013,
          mat("#e0c3a0"),
        );
    ball([-0.5, -1.23, -0.05], [0.11, 0.18, 0.11], mat("#b27d70"));
    ball([0.5, -1.23, -0.05], [0.11, 0.18, 0.11], mat("#b27d70"));
    for (let i = 0; i < 9; i++)
      ball(
        [
          0.12 * Math.sin(i * 2),
          0.38 + 0.1 * Math.cos(i),
          0.18 + 0.04 * (i % 3),
        ],
        [0.1, 0.1, 0.08],
        mat("#edba69"),
      );
    if (process)
      for (let i = 0; i < 12; i++) {
        const p = ball([0, 0, 0], [0.06, 0.05, 0.06], mat("#d67372"));
        particles.push({ mesh: p, offset: i / 12, vertical: true });
      }
  } else if (area === "blood") {
    const wall = add(
      new THREE.CylinderGeometry(0.55, 0.55, 3.4, 48, 1, true),
      mat("#a55f63", 0.3),
    );
    wall.rotation.z = Math.PI / 2;
    for (let i = 0; i < 16; i++)
      ball(
        [-1.5 + i * 0.19, 0.22 * Math.sin(i * 2), 0.2 * Math.cos(i)],
        [0.09, 0.05, 0.08],
        mat("#d67372"),
      );
    for (let i = 0; i < 6; i++) {
      const b = ball(
        [-0.9 + i * 0.36, 0.12 * Math.cos(i), 0.3],
        [0.12, 0.045, 0.05],
        mat("#f0808c"),
      );
      b.rotation.z = i * 0.7;
    }
  } else if (area === "kidneys") {
    const shape = new THREE.Shape();
    shape.moveTo(0.3, 1.25);
    shape.bezierCurveTo(-1.35, 1.55, -1.6, -1.5, 0.2, -1.25);
    shape.bezierCurveTo(0.9, -1.12, 0.65, -0.48, 0.28, -0.23);
    shape.bezierCurveTo(-0.05, 0, 0.2, 0.2, 0.58, 0.5);
    shape.bezierCurveTo(0.86, 0.83, 0.85, 1.17, 0.3, 1.25);
    const mesh = add(
      new THREE.ExtrudeGeometry(shape, {
        depth: 0.5,
        bevelEnabled: true,
        bevelThickness: 0.16,
        bevelSize: 0.13,
        bevelSegments: 5,
        steps: 1,
      }),
      mat("#a2655c"),
      [0.2, 0, -0.3],
    );
    for (let i = 0; i < 7; i++) {
      const a = -1.1 + i * 0.36;
      ball(
        [-0.33 + 0.48 * Math.cos(a + Math.PI), 0.8 * Math.sin(a), 0.38],
        [0.23, 0.15, 0.06],
        mat("#cf967a"),
      );
      tube(
        [
          [0.1, 0, 0.42],
          [-0.15 + 0.48 * Math.cos(a + Math.PI), 0.7 * Math.sin(a), 0.42],
        ],
        0.045,
        mat("#e1c394"),
      );
    }
    tube(
      [
        [0.15, 0, 0.38],
        [0.65, -0.1, 0.2],
        [0.62, -1.5, 0.1],
      ],
      0.09,
      mat("#d7bc93"),
    );
    // Magnified tissue inset: no side, extent or percentage of whole kidney is inferred.
    ball([0.75, 0.65, 0.42], [0.33, 0.33, 0.12], mat("#89b7b0", 0.65));
    for (let i = 0; i < 6; i++)
      tube(
        [
          [0.53 + i * 0.065, 0.46, 0.56],
          [0.54 + i * 0.065, 0.64, 0.58],
          [0.55 + i * 0.065, 0.85, 0.56],
        ],
        0.018,
        mat("#d5dbb4"),
      );
  } else if (area === "hip") {
    const metal = mat("#b5c9d0"),
      bone = mat("#dfd1b6", 0.55);
    tube(
      [
        [0, 0.1, 0],
        [0.05, -0.55, 0],
        [0.02, -1.45, 0],
      ],
      0.22,
      bone,
    );
    tube(
      [
        [0, 0.1, 0],
        [0.07, -0.7, 0.06],
        [0.03, -1.15, 0.06],
      ],
      0.1,
      metal,
    );
    tube(
      [
        [0.03, 0.13, 0],
        [-0.36, 0.48, 0],
        [-0.53, 0.57, 0],
      ],
      0.13,
      metal,
    );
    ball([-0.6, 0.66, 0], [0.35, 0.35, 0.35], metal);
    ball([-0.7, 0.75, -0.15], [0.57, 0.53, 0.24], bone);
    ball([0.55, 0, 0.14], [0.22, 0.95, 0.28], mat("#b39184", 0.3));
    tube(
      [
        [0.65, 0.48, 0.44],
        [0.63, 0.03, 0.46],
        [0.61, -0.4, 0.44],
      ],
      0.025,
      mat("#b4a3d9"),
    );
  }
  if (!process || (area !== "brain" && area !== "blood")) {
    for (const r of DIAGRAMS[area].regions) {
      const m = ball(r.position, r.scale, mat(REGION_COLORS[r.kind], 0.8));
      m.userData.region = r.id;
      targets.push(m);
      // Bilateral report findings get paired region indicators, without invented lesion counts.
      if (
        area === "brain" &&
        ["cerebral", "peri", "cerebellum", "ventricles"].includes(r.id)
      ) {
        const p = [...r.position];
        p[0] = -p[0];
        const paired = ball(p, r.scale, mat(REGION_COLORS[r.kind], 0.7));
        paired.userData.region = r.id;
        targets.push(paired);
      }
      if (area === "brain" && r.id === "ventricles") {
        const fourth = ball(
          [0, -0.79, -0.18],
          [0.06, 0.08, 0.06],
          mat(REGION_COLORS.bleed, 0.8),
        );
        fourth.userData.region = r.id;
        targets.push(fourth);
      }
    }
  }
  return { group, particles, targets };
}

export default function ClinicalScene({ area, selected, onSelect, mode }) {
  const host = useRef(),
    runtime = useRef(),
    labels = useRef({}),
    selectedRef = useRef(selected),
    selectRef = useRef(onSelect);
  const [auto, setAuto] = useState(false),
    [playing, setPlaying] = useState(false),
    [failed, setFailed] = useState(false);
  const playRef = useRef(playing),
    autoRef = useRef(auto);
  selectedRef.current = selected;
  selectRef.current = onSelect;
  playRef.current = playing;
  autoRef.current = auto;
  const diagram = DIAGRAMS[area],
    process = mode === "process";
  useEffect(() => {
    const node = host.current;
    let renderer;
    setFailed(false);
    setPlaying(false);
    setAuto(false);
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setFailed(true);
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setClearColor(0, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    node.appendChild(renderer.domElement);
    const scene = new THREE.Scene(),
      camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
    camera.position.set(0, 0.05, 6.7);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 3.3;
    controls.maxDistance = 11;
    controls.autoRotateSpeed = 0.7;
    scene.add(new THREE.HemisphereLight(0xf0f7eb, 0x193e37, 2.4));
    const key = new THREE.DirectionalLight(0xffe3c5, 3);
    key.position.set(-3, 4, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x99e5e1, 2.8);
    rim.position.set(3, 1, -3);
    scene.add(rim);
    const model = makeModel(area, process);
    scene.add(model.group);
    const resize = () => {
      renderer.setSize(node.clientWidth, node.clientHeight);
      camera.aspect = node.clientWidth / node.clientHeight;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(node);
    resize();
    let start,
      frame,
      elapsed = 0,
      last = 0;
    const ray = new THREE.Raycaster();
    const down = (e) => {
      start = [e.clientX, e.clientY];
    };
    const up = (e) => {
      if (!start || Math.hypot(e.clientX - start[0], e.clientY - start[1]) > 6)
        return;
      const r = renderer.domElement.getBoundingClientRect();
      ray.setFromCamera(
        new THREE.Vector2(
          ((e.clientX - r.left) / r.width) * 2 - 1,
          (-(e.clientY - r.top) / r.height) * 2 + 1,
        ),
        camera,
      );
      const hit = ray.intersectObjects(model.targets)[0];
      if (hit) selectRef.current(hit.object.userData.region);
    };
    renderer.domElement.addEventListener("pointerdown", down);
    renderer.domElement.addEventListener("pointerup", up);
    const animate = (t) => {
      frame = requestAnimationFrame(animate);
      if (playRef.current) elapsed += Math.min(50, t - last);
      last = t;
      controls.autoRotate = autoRef.current;
      controls.update();
      model.targets.forEach((m) => {
        m.material.emissive.set(
          m.userData.region === selectedRef.current
            ? REGION_COLORS[
                diagram.regions.find((r) => r.id === m.userData.region).kind
              ]
            : "#000000",
        );
        m.material.emissiveIntensity = 0.3;
      });
      model.particles.forEach(({ mesh, offset, vertical }) => {
        let v = (elapsed * 0.00015 + offset) % 1;
        if (area === "brain") v = v * 0.42;
        mesh.position.set(
          vertical ? 0.25 * Math.sin(offset * 20) : -1.65 + v * 3.3,
          vertical ? -1.25 + v * 2.5 : 0.2 * Math.sin(offset * 20),
          0.18 * Math.cos(offset * 14),
        );
      });
      const placed = [];
      diagram.regions.forEach((r) => {
        const el = labels.current[r.id];
        if (!el) return;
        const p = new THREE.Vector3(...r.position).project(camera);
        const anchorX = (p.x * 0.5 + 0.5) * node.clientWidth,
          anchorY = (-p.y * 0.5 + 0.5) * node.clientHeight;
        let x = anchorX,
          y = anchorY;
        for (let pass = 0; pass < 12; pass++) {
          const near = placed.find((q) => Math.hypot(q.x - x, q.y - y) < 34);
          if (!near) break;
          x += x >= near.x ? 9 : -9;
          y -= 15;
        }
        x = Math.max(18, Math.min(node.clientWidth - 18, x));
        y = Math.max(18, Math.min(node.clientHeight - 18, y));
        placed.push({ x, y });
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        const leader = node.querySelector(`[data-leader="${r.id}"]`);
        if (leader) {
          leader.setAttribute("x1", anchorX);
          leader.setAttribute("y1", anchorY);
          leader.setAttribute("x2", x);
          leader.setAttribute("y2", y);
        }
      });
      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(animate);
    runtime.current = { camera, controls };
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      controls.dispose();
      renderer.domElement.removeEventListener("pointerdown", down);
      renderer.domElement.removeEventListener("pointerup", up);
      scene.traverse((o) => {
        o.geometry?.dispose();
        (Array.isArray(o.material) ? o.material : [o.material])
          .filter(Boolean)
          .forEach((m) => m.dispose());
      });
      renderer.dispose();
      renderer.domElement.remove();
      runtime.current = null;
    };
  }, [area, process]);
  const reset = () => {
    runtime.current?.camera.position.set(0, 0.05, 6.7);
    runtime.current?.controls.target.set(0, 0, 0);
    runtime.current?.controls.update();
    setAuto(false);
  };
  return (
    <div className="anatomy-stage clinical-stage">
      <div className="scene-grid" />
      <div className="scene-top">
        <span className="scene-tag">
          <span />{" "}
          {process ? "ILLUSTRATIVE MECHANISM" : "REPORT-BASED REGION MAP"}
        </span>
        <span className="scene-view">
          {process && (area === "brain" || area === "blood")
            ? "Illustrative artery / vessel segment"
            : diagram.orientation}
        </span>
      </div>
      <div className="diagram-title">
        <h3>{process ? "How the injury can happen" : diagram.title}</h3>
        <span>
          {process
            ? "Education · not a live patient simulation"
            : `Evidence dated ${diagram.date}`}
        </span>
      </div>
      <div
        className="scene-canvas"
        ref={host}
        aria-label={`Interactive 3D ${diagram.title}`}
      >
        {failed && (
          <div className="scene-fallback">
            <Icon name="diagram" size={50} />
            <p>3D is unavailable in this browser.</p>
            <small>All locations and evidence remain available below.</small>
          </div>
        )}
        {!process && !failed && (
          <svg className="region-leaders" aria-hidden="true">
            {diagram.regions.map((r) => (
              <line
                key={r.id}
                data-leader={r.id}
                stroke={REGION_COLORS[r.kind]}
                strokeWidth="1"
                opacity=".7"
              />
            ))}
          </svg>
        )}
        {!process &&
          !failed &&
          diagram.regions.map((r, i) => (
            <button
              key={r.id}
              className={`region-pin ${selected === r.id ? "active" : ""}`}
              ref={(el) => (labels.current[r.id] = el)}
              style={{ "--region-color": REGION_COLORS[r.kind] }}
              aria-label={`Locate ${r.name}`}
              aria-pressed={selected === r.id}
              onClick={() => onSelect(r.id)}
            >
              {i + 1}
            </button>
          ))}
      </div>
      <div className="scene-bottom">
        <span>Drag to rotate · Pinch / scroll to zoom</span>
        <div className="scene-tools">
          {process && ["brain", "heart", "blood"].includes(area) && (
            <button
              className="play-process"
              onClick={() => setPlaying(!playing)}
              aria-pressed={playing}
            >
              {playing ? "Pause illustration" : "Play illustration"}
            </button>
          )}
          <button
            onClick={() => setAuto(!auto)}
            aria-label="Toggle auto rotation"
            aria-pressed={auto}
            className={auto ? "on" : ""}
          >
            <Icon name="rotate" size={18} />
          </button>
          <button onClick={reset} aria-label="Reset 3D view">
            <Icon name="expand" size={18} />
          </button>
        </div>
      </div>
      <div className="model-caption">
        {process
          ? "Possible mechanism · does not establish ongoing damage"
          : "Region indicators · not exact lesion outlines · not to scale"}
      </div>
    </div>
  );
}
