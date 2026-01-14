'use client';
import { useEffect, useRef } from 'react';

export function FireBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Particle System (Sharp Flame Tongues)
        const particles: FlameParticle[] = [];
        const particleCount = 60; // Fewer, but more complex shapes

        class FlameParticle {
            x: number;
            y: number;
            size: number;
            speedY: number;
            life: number;
            maxLife: number;
            angle: number;
            wiggleSpeed: number;

            constructor() {
                this.x = Math.random() * canvas!.width;
                this.y = canvas!.height + Math.random() * 20;
                this.size = Math.random() * 40 + 20;
                this.speedY = Math.random() * 4 + 2;
                this.life = 0;
                this.maxLife = Math.random() * 60 + 30;
                this.angle = Math.random() * Math.PI * 2;
                this.wiggleSpeed = Math.random() * 0.1 + 0.05;
            }

            update() {
                this.y -= this.speedY;
                this.angle += this.wiggleSpeed;
                this.x += Math.sin(this.angle) * 1.5;
                this.size *= 0.95;
                this.life++;
            }

            draw() {
                if (!ctx) return;

                const progress = this.life / this.maxLife;
                const alpha = 1 - progress;

                // Fire Gradient Logic (Hot -> Cold)
                let color;
                if (progress < 0.2) color = `rgba(255, 255, 200, ${alpha})`; // Center stroke white
                else if (progress < 0.5) color = `rgba(255, 140, 0, ${alpha})`; // Mid Orange
                else color = `rgba(200, 20, 0, ${alpha})`; // Tip Red

                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.scale(this.size / 20, this.size / 20); // Scale the shape

                // Draw Sharp Flame Shape using Bezier Curves
                ctx.beginPath();
                ctx.fillStyle = color;

                // Shape: A tear-drop that points up, but wiggly
                ctx.moveTo(0, 0);
                // Right Curve
                ctx.quadraticCurveTo(10, -10, 0, -30);
                // Left Curve
                ctx.quadraticCurveTo(-10, -10, 0, 0);

                ctx.fill();
                ctx.restore();
            }
        }

        // Init particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new FlameParticle());
        }

        // Animation Loop
        const animate = () => {
            // Clear with minimal trails for sharpness
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // "Screen" makes them glow where they overlap
            ctx.globalCompositeOperation = 'screen';

            // NO BLUR for sharpness
            ctx.filter = 'none';

            particles.forEach((p, index) => {
                p.update();
                p.draw();
                if (p.life >= p.maxLife || p.size <= 0.5) {
                    particles[index] = new FlameParticle();
                }
            });
            requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full rounded-xl opacity-80 mix-blend-screen pointer-events-none"
        />
    );
}
