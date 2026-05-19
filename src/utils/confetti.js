export const triggerConfetti = () => {
  try {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    
    const colors = ['#FFC107', '#FF5722', '#E91E63', '#00BCD4', '#4CAF50', '#E040FB', '#18FFFF', '#FFEB3B'];
    const particles = Array.from({ length: 250 }).map(() => {
      const launchPoint = Math.floor(Math.random() * 3); // 0 = Left, 1 = Center, 2 = Right
      let x = canvas.width / 2;
      let vx = (Math.random() - 0.5) * 15;
      let vy = -Math.random() * 28 - 14;

      if (launchPoint === 0) { // Left corner shooting inwards
        x = 0;
        vx = Math.random() * 20 + 5;
        vy = -Math.random() * 22 - 15;
      } else if (launchPoint === 2) { // Right corner shooting inwards
        x = canvas.width;
        vx = -Math.random() * 20 - 5;
        vy = -Math.random() * 22 - 15;
      }

      return {
        x,
        y: canvas.height + 20,
        vx,
        vy,
        size: Math.random() * 13 + 6, // larger size
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 18,
        opacity: 1
      };
    });
    
    let frame = 0;
    const anim = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.6; // gravity
        p.vx *= 0.98; // horizontal air resistance
        p.rotation += p.rSpeed;
        
        // Start fading near the end of life
        if (p.vy > 5) {
          p.opacity -= 0.02;
        }
        
        if (p.y < canvas.height + 20 && p.opacity > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.opacity);
          
          // Draw random shapes (squares or rectangles or triangles)
          if (p.size % 2 === 0) {
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          } else {
            ctx.beginPath();
            ctx.moveTo(0, -p.size / 2);
            ctx.lineTo(p.size / 2, p.size / 2);
            ctx.lineTo(-p.size / 2, p.size / 2);
            ctx.closePath();
            ctx.fill();
          }
          ctx.restore();
        }
      });
      
      frame++;
      if (alive && frame < 150) {
        requestAnimationFrame(anim);
      } else {
        window.removeEventListener('resize', handleResize);
        canvas.remove();
      }
    };
    anim();
  } catch (e) {
    console.warn("Confetti creation failed", e);
  }
};
