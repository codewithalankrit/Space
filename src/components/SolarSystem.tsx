import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { Stars, Text, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Play, Pause, Sun as SunIcon, Moon } from 'lucide-react';

// Import planet textures
import mercuryTexture from '@/assets/mercury-texture.jpg';
import venusTexture from '@/assets/venus-texture.jpg';
import earthTexture from '@/assets/earth-texture.jpg';
import marsTexture from '@/assets/mars-texture.jpg';
import jupiterTexture from '@/assets/jupiter-texture.jpg';
import saturnTexture from '@/assets/saturn-texture.jpg';
import uranusTexture from '@/assets/uranus-texture.jpg';
import neptuneTexture from '@/assets/neptune-texture.jpg';
import sunTexture from '@/assets/sun-texture.jpg';

// Planet data with realistic relative sizes and distances
const planetsData = [
  { 
    name: 'Mercury', 
    size: 0.15, 
    distance: 3.5, 
    color: '#FFA500', 
    speed: 2.0, 
    texture: mercuryTexture,
    info: {
      diameter: '4,879 km',
      distanceFromSun: '57.9 million km',
      yearLength: '88 Earth days',
      dayLength: '59 Earth days',
      moons: '0',
      composition: 'Rocky planet with iron core',
      temperature: '-173°C to 427°C'
    }
  },
  { 
    name: 'Venus', 
    size: 0.38, 
    distance: 5.0, 
    color: '#FFC649', 
    speed: 1.62, 
    texture: venusTexture,
    info: {
      diameter: '12,104 km',
      distanceFromSun: '108.2 million km',
      yearLength: '225 Earth days',
      dayLength: '243 Earth days',
      moons: '0',
      composition: 'Rocky planet with thick atmosphere',
      temperature: '462°C (hottest planet)'
    }
  },
  { 
    name: 'Earth', 
    size: 0.4, 
    distance: 6.5, 
    color: '#6B93D6', 
    speed: 1.0, 
    texture: earthTexture,
    info: {
      diameter: '12,756 km',
      distanceFromSun: '149.6 million km',
      yearLength: '365.25 days',
      dayLength: '24 hours',
      moons: '1 (The Moon)',
      composition: 'Rocky planet with water and life',
      temperature: '-89°C to 58°C'
    }
  },
  { 
    name: 'Mars', 
    size: 0.21, 
    distance: 8.5, 
    color: '#CD5C5C', 
    speed: 0.53, 
    texture: marsTexture,
    info: {
      diameter: '6,792 km',
      distanceFromSun: '227.9 million km',
      yearLength: '687 Earth days',
      dayLength: '24.6 hours',
      moons: '2 (Phobos, Deimos)',
      composition: 'Rocky planet with iron oxide',
      temperature: '-87°C to -5°C'
    }
  },
  { 
    name: 'Jupiter', 
    size: 1.4, 
    distance: 12.0, 
    color: '#D8CA9D', 
    speed: 0.084, 
    texture: jupiterTexture,
    info: {
      diameter: '142,984 km',
      distanceFromSun: '778.6 million km',
      yearLength: '12 Earth years',
      dayLength: '9.9 hours',
      moons: '95+ (including Io, Europa, Ganymede)',
      composition: 'Gas giant (hydrogen and helium)',
      temperature: '-108°C'
    }
  },
  { 
    name: 'Saturn', 
    size: 1.2, 
    distance: 16.0, 
    color: '#FAD5A5', 
    speed: 0.034, 
    texture: saturnTexture,
    info: {
      diameter: '120,536 km',
      distanceFromSun: '1.43 billion km',
      yearLength: '29 Earth years',
      dayLength: '10.7 hours',
      moons: '146+ (including Titan, Enceladus)',
      composition: 'Gas giant with prominent rings',
      temperature: '-139°C'
    }
  },
  { 
    name: 'Uranus', 
    size: 0.6, 
    distance: 20.5, 
    color: '#4FD0E3', 
    speed: 0.012, 
    texture: uranusTexture,
    info: {
      diameter: '51,118 km',
      distanceFromSun: '2.87 billion km',
      yearLength: '84 Earth years',
      dayLength: '17.2 hours',
      moons: '27+ (including Titania, Oberon)',
      composition: 'Ice giant (water, methane, ammonia)',
      temperature: '-197°C'
    }
  },
  { 
    name: 'Neptune', 
    size: 0.58, 
    distance: 25.0, 
    color: '#4B70DD', 
    speed: 0.006, 
    texture: neptuneTexture,
    info: {
      diameter: '49,528 km',
      distanceFromSun: '4.5 billion km',
      yearLength: '165 Earth years',
      dayLength: '16.1 hours',
      moons: '16+ (including Triton)',
      composition: 'Ice giant with strong winds',
      temperature: '-201°C'
    }
  }
];

interface PlanetProps {
  name: string;
  size: number;
  distance: number;
  color: string;
  speed: number;
  texture: string;
  isPaused: boolean;
  speedMultiplier: number;
  onHover: (name: string | null) => void;
}

function Planet({ name, size, distance, color, speed, texture, isPaused, speedMultiplier, onHover }: PlanetProps) {
  const planetRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const planetTexture = useLoader(THREE.TextureLoader, texture);

  useFrame((state) => {
    if (orbitRef.current && !isPaused) {
      orbitRef.current.rotation.y += speed * speedMultiplier * 0.01;
    }
    
    // Planet self-rotation
    if (planetRef.current && !isPaused) {
      planetRef.current.rotation.y += 0.02;
    }
  });

  return (
    <group ref={orbitRef}>
      {/* Orbit line */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[distance - 0.01, distance + 0.01, 64]} />
        <meshBasicMaterial color="#444" transparent opacity={0.3} />
      </mesh>
      
      {/* Planet */}
      <mesh
        ref={planetRef}
        position={[distance, 0, 0]}
        scale={hovered ? size * 1.2 : size}
        onPointerEnter={() => {
          setHovered(true);
          onHover(name);
        }}
        onPointerLeave={() => {
          setHovered(false);
          onHover(null);
        }}
      >
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial 
          map={planetTexture}
          roughness={name === 'Venus' ? 0.1 : 0.7}
          metalness={name === 'Mercury' ? 0.2 : 0.05}
          emissive={color} 
          emissiveIntensity={hovered ? 0.15 : 0.08}
        />
      </mesh>
      
      {/* Saturn's rings */}
      {name === 'Saturn' && (
        <mesh position={[distance, 0, 0]} rotation={[Math.PI / 4, 0, 0]}>
          <ringGeometry args={[size * 1.2, size * 1.8, 32]} />
          <meshPhongMaterial color="#FAD5A5" transparent opacity={0.7} side={THREE.DoubleSide} />
        </mesh>
      )}
      
      {/* Planet label */}
      {hovered && (
        <Text
          position={[distance, size + 0.5, 0]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {name}
        </Text>
      )}
    </group>
  );
}

function Sun() {
  const sunRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Mesh>(null);
  const flareRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const prominenceRef = useRef<THREE.Group>(null);
  const sunTextureMap = useLoader(THREE.TextureLoader, sunTexture);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Main sun rotation with realistic tilt
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.005; // Realistic rotation speed (27 days)
      sunRef.current.rotation.x = Math.sin(time * 0.1) * 0.02; // Subtle wobble
    }
    
    // Animated corona with pulsing effect
    if (coronaRef.current) {
      coronaRef.current.rotation.y -= 0.003;
      coronaRef.current.rotation.z += 0.001;
      const pulse = 1.1 + Math.sin(time * 0.8) * 0.05;
      coronaRef.current.scale.setScalar(pulse);
    }
    
    // Solar flares with dynamic intensity
    if (flareRef.current) {
      flareRef.current.rotation.y += 0.004;
      flareRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
      const flareIntensity = 1.3 + Math.sin(time * 1.2) * 0.1;
      flareRef.current.scale.setScalar(flareIntensity);
    }
    
    // Outer atmosphere shimmer
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y -= 0.001;
      const shimmer = 1.6 + Math.sin(time * 0.5) * 0.08;
      atmosphereRef.current.scale.setScalar(shimmer);
    }
    
    // Solar prominence effects
    if (prominenceRef.current) {
      prominenceRef.current.rotation.y += 0.002;
      prominenceRef.current.children.forEach((child, index) => {
        if (child instanceof THREE.Mesh) {
          child.rotation.z = Math.sin(time * (0.5 + index * 0.2)) * 0.3;
          child.scale.y = 1 + Math.sin(time * (1 + index * 0.3)) * 0.2;
        }
      });
    }
  });

  return (
    <group>
      {/* Main sun core with enhanced materials */}
      <mesh ref={sunRef} rotation={[0, 0, Math.PI / 12]}>
        <sphereGeometry args={[0.8, 128, 128]} />
        <meshStandardMaterial 
          map={sunTextureMap}
          emissive="#FF6B00" 
          emissiveIntensity={3.2}
          roughness={0.8}
          metalness={0.1}
          bumpMap={sunTextureMap}
          bumpScale={0.05}
        />
      </mesh>
      
      {/* Inner corona layer - bright orange */}
      <mesh ref={coronaRef} rotation={[0, 0, Math.PI / 12]}>
        <sphereGeometry args={[0.85, 64, 64]} />
        <meshBasicMaterial 
          color="#FF8C00" 
          transparent 
          opacity={0.8}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Solar flares layer - dynamic activity */}
      <mesh ref={flareRef} rotation={[0, 0, Math.PI / 12]}>
        <sphereGeometry args={[0.9, 48, 48]} />
        <meshBasicMaterial 
          color="#FFAA00" 
          transparent 
          opacity={0.6}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Middle atmosphere - yellow glow */}
      <mesh scale={1.4} rotation={[0, 0, Math.PI / 12]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshBasicMaterial 
          color="#FFD700" 
          transparent 
          opacity={0.35}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Outer atmosphere - animated shimmer */}
      <mesh ref={atmosphereRef} rotation={[0, 0, Math.PI / 12]}>
        <sphereGeometry args={[0.8, 24, 24]} />
        <meshBasicMaterial 
          color="#FFEEAA" 
          transparent 
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Solar prominences - flame-like protrusions */}
      <group ref={prominenceRef}>
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const x = Math.cos(angle) * 0.9;
          const z = Math.sin(angle) * 0.9;
          return (
            <mesh 
              key={i}
              position={[x, 0, z]}
              rotation={[0, angle, 0]}
            >
              <coneGeometry args={[0.05, 0.3, 8]} />
              <meshBasicMaterial 
                color="#FF4500" 
                transparent 
                opacity={0.7}
              />
            </mesh>
          );
        })}
      </group>
      
      {/* Heat distortion effect - outermost layer */}
      <mesh scale={2.2} rotation={[0, 0, Math.PI / 12]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial 
          color="#FFDDAA" 
          transparent 
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Solar wind effect */}
      <mesh scale={2.8} rotation={[0, 0, Math.PI / 12]}>
        <sphereGeometry args={[0.8, 12, 12]} />
        <meshBasicMaterial 
          color="#FFFFCC" 
          transparent 
          opacity={0.02}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

function SolarSystemScene({ isPaused, planetSpeeds, hoveredPlanet, setHoveredPlanet }: {
  isPaused: boolean;
  planetSpeeds: { [key: string]: number };
  hoveredPlanet: string | null;
  setHoveredPlanet: (planet: string | null) => void;
}) {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(0, 15, 15);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <>
      {/* Better lighting for full planet visibility */}
      <ambientLight intensity={0.8} color="#404080" />
      <pointLight 
        position={[0, 0, 0]} 
        intensity={12} 
        color="#FFD700" 
        distance={0}
        decay={1}
      />
      <hemisphereLight 
        args={["#ffffff", "#444444", 1.2]}
      />
      {/* Additional fill lights to illuminate the dark sides */}
      <directionalLight 
        position={[10, 10, 10]} 
        intensity={0.5} 
        color="#ffffff"
      />
      <directionalLight 
        position={[-10, -10, -10]} 
        intensity={0.3} 
        color="#404080"
      />
      
      {/* Enhanced background stars */}
      <Stars 
        radius={300} 
        depth={100} 
        count={8000} 
        factor={6} 
        saturation={0} 
        fade={true}
        speed={0.2}
      />
      
      {/* Sun */}
      <Sun />
      
      {/* Planets */}
      {planetsData.map((planet) => (
        <Planet
          key={planet.name}
          {...planet}
          isPaused={isPaused}
          speedMultiplier={planetSpeeds[planet.name] || 1}
          onHover={setHoveredPlanet}
        />
      ))}
      
      {/* Camera controls */}
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={50}
      />
    </>
  );
}

export default function SolarSystem() {
  const [isPaused, setIsPaused] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [planetSpeeds, setPlanetSpeeds] = useState<{ [key: string]: number }>({});
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);

  // Initialize planet speeds to 0.1x
  useEffect(() => {
    const initialSpeeds: { [key: string]: number } = {};
    planetsData.forEach(planet => {
      initialSpeeds[planet.name] = 0.1;
    });
    setPlanetSpeeds(initialSpeeds);
  }, []);

  const handleSpeedChange = (planetName: string, speed: number) => {
    setPlanetSpeeds(prev => ({
      ...prev,
      [planetName]: speed
    }));
  };

  const resetSpeeds = () => {
    const resetSpeeds: { [key: string]: number } = {};
    planetsData.forEach(planet => {
      resetSpeeds[planet.name] = 0.1;
    });
    setPlanetSpeeds(resetSpeeds);
  };

  return (
    <div className={`min-h-screen bg-gradient-nebula ${isDarkMode ? '' : 'light'}`}>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            🌌 Solar System Simulation
          </h1>
          
          <div className="flex items-center gap-4">
            {/* Dark/Light mode toggle */}
            <div className="flex items-center gap-2">
              <SunIcon className="h-4 w-4 text-accent" />
              <Switch
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
              />
              <Moon className="h-4 w-4 text-primary" />
            </div>
            
            {/* Play/Pause button */}
            <Button
              onClick={() => setIsPaused(!isPaused)}
              variant="secondary"
              className="flex items-center gap-2"
            >
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
          </div>
        </div>
      </div>

      {/* 3D Scene */}
      <div className="w-full h-screen">
        <Canvas>
          <SolarSystemScene 
            isPaused={isPaused}
            planetSpeeds={planetSpeeds}
            hoveredPlanet={hoveredPlanet}
            setHoveredPlanet={setHoveredPlanet}
          />
        </Canvas>
      </div>

      {/* Control Panel */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <Card className="p-4 bg-card/90 backdrop-blur-sm border-border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-card-foreground">Planet Speed Controls</h3>
            <Button onClick={resetSpeeds} variant="outline" size="sm">
              Reset All Speeds
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {planetsData.map((planet) => (
              <div key={planet.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label 
                    className="text-sm font-medium text-card-foreground"
                    style={{ color: planet.name === hoveredPlanet ? planet.color : undefined }}
                  >
                    {planet.name}
                  </label>
                  <span className="text-xs text-muted-foreground">
                    {(planetSpeeds[planet.name] || 1).toFixed(1)}x
                  </span>
                </div>
                <Slider
                  value={[planetSpeeds[planet.name] || 1]}
                  onValueChange={([value]) => handleSpeedChange(planet.name, value)}
                  min={0}
                  max={5}
                  step={0.1}
                  className="w-full"
                />
              </div>
            ))}
          </div>
          
          {hoveredPlanet && (() => {
            const planet = planetsData.find(p => p.name === hoveredPlanet);
            return planet ? (
              <div className="mt-4 p-4 rounded-lg bg-muted border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <h4 className="text-lg font-bold text-foreground" style={{ color: planet.color }}>
                    {planet.name}
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground">Diameter:</span>
                    <p className="font-medium text-foreground">{planet.info.diameter}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Distance from Sun:</span>
                    <p className="font-medium text-foreground">{planet.info.distanceFromSun}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Year Length:</span>
                    <p className="font-medium text-foreground">{planet.info.yearLength}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Day Length:</span>
                    <p className="font-medium text-foreground">{planet.info.dayLength}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Moons:</span>
                    <p className="font-medium text-foreground">{planet.info.moons}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Temperature:</span>
                    <p className="font-medium text-foreground">{planet.info.temperature}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Composition:</span>
                    <p className="font-medium text-foreground">{planet.info.composition}</p>
                  </div>
                </div>
              </div>
            ) : null;
          })()}
        </Card>
      </div>

      {/* Instructions */}
      <div className="absolute top-20 right-4 z-10">
        <Card className="p-4 bg-card/90 backdrop-blur-sm border-border max-w-xs">
          <h4 className="text-sm font-semibold text-card-foreground mb-2">Controls</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Click and drag to rotate view</li>
            <li>• Scroll to zoom in/out</li>
            <li>• Hover over planets for labels</li>
            <li>• Adjust speeds with sliders below</li>
            <li>• Use pause/resume button</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
