import feather from 'feather-icons';
import * as simpleIcons from 'simple-icons';

document.addEventListener("DOMContentLoaded", () => {
  const isContactPage = document.querySelector(".page.contact-page");
  if (!isContactPage) return;

  const container = document.querySelector(".trail-container");
  let isDesktop = window.innerWidth > 1000;
  let animationId = null;
  let mouseMoveListener = null;

  const config = {
    iconCount: 15,
    iconLifespan: 750,
    removalDelay: 50,
    mouseThreshold: 100,
    inDuration: 750,
    outDuration: 1000,
    inEasing: "cubic-bezier(.07,.5,.5,1)",
    outEasing: "cubic-bezier(.87, 0, .13, 1)",
  };

  // Tech and programming related Feather icons (verified to exist)
  const featherIconNames = [
    'code', 'terminal', 'cpu', 'database', 'server', 'globe', 'monitor', 
    'smartphone', 'hard-drive', 'file-text', 'folder', 'git-branch', 
    'git-commit', 'git-merge', 'github', 'settings', 'tool', 'cloud', 
    'upload-cloud', 'download-cloud', 'shield', 'lock', 'unlock', 'search', 
    'activity', 'bar-chart', 'bar-chart-2', 'trending-up', 'trending-down', 
    'zap', 'bluetooth', 'camera', 'play', 'pause', 'mic', 'mic-off',
    'headphones', 'link', 'link-2', 'external-link', 'share', 'share-2', 
    'download', 'upload', 'mail', 'message-circle', 'message-square', 
    'phone', 'phone-call', 'users', 'user', 'grid', 'layout', 'sidebar', 
    'menu', 'filter', 'power', 'refresh-cw', 'refresh-ccw', 'copy', 
    'edit', 'save', 'tag', 'hash', 'codesandbox', 'codepen', 'gitlab',
    'instagram', 'linkedin', 'pen-tool', 'shield-off', 'user-check',
    'user-plus', 'user-minus', 'user-x', 'play-circle', 'pause-circle',
    'phone-incoming', 'phone-outgoing', 'phone-missed', 'phone-off'
  ];

  // Programming language and framework icons from Simple Icons
  const programmingLanguageIcons = [
    'siJavascript', 'siTypescript', 'siPython', 'siJava', 'siCsharp', 'siCplusplus', 'siC',
    'siGo', 'siRust', 'siRuby', 'siPhp', 'siSwift', 'siKotlin', 'siDart', 'siScala', 'siHaskell',
    'siLua', 'siPerl', 'siR', 'siHtml5', 'siCss3', 'siSass', 'siLess',
    'siReact', 'siVuedotjs', 'siAngular', 'siSvelte', 'siNodedotjs', 'siExpress', 'siNextdotjs',
    'siDjango', 'siFlask', 'siSpring', 'siLaravel', 'siRubyonrails', 'siDotnet', 'siFlutter',
    'siUnity', 'siUnrealengine', 'siGodotengine', 'siDocker', 'siKubernetes', 'siGit', 'siGithub',
    'siGitlab', 'siIntellijidea', 'siEclipseide', 'siAndroid', 'siIos',
    'siLinux', 'siUbuntu', 'siMacos', 'siMysql', 'siPostgresql', 'siMongodb', 'siRedis',
    'siGooglecloud', 'siVercel', 'siNetlify', 'siHeroku'
  ];

  // Combine both icon arrays
  const allIconNames = [...featherIconNames, ...programmingLanguageIcons];

  // Color palette for icons
  const iconColors = [
    '#3B82F6', // Blue
    '#10B981', // Green  
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#06B6D4', // Cyan
    '#F97316', // Orange
    '#84CC16', // Lime
    '#EC4899', // Pink
    '#6366F1', // Indigo
    '#14B8A6', // Teal
    '#F43F5E'  // Rose
  ];

  const trail = [];

  let mouseX = 0,
    mouseY = 0,
    lastMouseX = 0,
    lastMouseY = 0;
  let isCursorInContainer = false;
  let lastRemovalTime = 0;

  const isInContainer = (x, y) => {
    const rect = container.getBoundingClientRect();
    return (
      x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
    );
  };

  const hasMovedEnough = () => {
    const distance = Math.sqrt(
      Math.pow(mouseX - lastMouseX, 2) + Math.pow(mouseY - lastMouseY, 2)
    );
    return distance > config.mouseThreshold;
  };

  const createIcon = () => {
    const iconElement = document.createElement("div");
    iconElement.classList.add("trail-icon");

    const randomIconIndex = Math.floor(Math.random() * allIconNames.length);
    const randomColorIndex = Math.floor(Math.random() * iconColors.length);
    const rotation = (Math.random() - 0.5) * 50;
    
    const iconName = allIconNames[randomIconIndex];
    const color = iconColors[randomColorIndex];
    
    // Check if it's a Simple Icons (programming language) icon
    if (iconName.startsWith('si')) {
      const simpleIcon = simpleIcons[iconName];
      if (simpleIcon) {
        // Create SVG element manually for Simple Icons
        const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgElement.setAttribute("width", "32");
        svgElement.setAttribute("height", "32");
        svgElement.setAttribute("viewBox", "0 0 24 24");
        svgElement.setAttribute("role", "img");
        
        // Create path element with the icon data
        const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
        pathElement.setAttribute("d", simpleIcon.path);
        pathElement.setAttribute("fill", color);
        
        svgElement.appendChild(pathElement);
        iconElement.appendChild(svgElement);
      } else {
        // Fallback to Feather code icon
        iconElement.innerHTML = feather.icons['code'].toSvg({ 
          width: 32, 
          height: 32, 
          color: color,
          'stroke-width': 2 
        });
      }
    } else {
      // Use Feather icons
      const iconSvg = feather.icons[iconName];
      if (iconSvg) {
        iconElement.innerHTML = iconSvg.toSvg({ 
          width: 32, 
          height: 32, 
          color: color,
          'stroke-width': 2 
        });
      } else {
        // Fallback if icon doesn't exist
        iconElement.innerHTML = feather.icons['code'].toSvg({ 
          width: 32, 
          height: 32, 
          color: color,
          'stroke-width': 2 
        });
      }
    }

    const rect = container.getBoundingClientRect();
    const relativeX = mouseX - rect.left;
    const relativeY = mouseY - rect.top;

    iconElement.style.left = `${relativeX}px`;
    iconElement.style.top = `${relativeY}px`;
    iconElement.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(0)`;
    iconElement.style.transition = `transform ${config.inDuration}ms ${config.inEasing}`;

    container.appendChild(iconElement);

    setTimeout(() => {
      iconElement.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(1)`;
    }, 10);

    trail.push({
      element: iconElement,
      rotation: rotation,
      removeTime: Date.now() + config.iconLifespan,
    });
  };

  const removeOldIcons = () => {
    const now = Date.now();

    if (now - lastRemovalTime < config.removalDelay || trail.length === 0)
      return;

    const oldestIcon = trail[0];
    if (now >= oldestIcon.removeTime) {
      const iconToRemove = trail.shift();

      iconToRemove.element.style.transition = `transform ${config.outDuration}ms ${config.outEasing}`;
      iconToRemove.element.style.transform = `translate(-50%, -50%) rotate(${iconToRemove.rotation}deg) scale(0)`;

      lastRemovalTime = now;

      setTimeout(() => {
        if (iconToRemove.element.parentNode) {
          iconToRemove.element.parentNode.removeChild(iconToRemove.element);
        }
      }, config.outDuration);
    }
  };

  const startAnimation = () => {
    if (!isDesktop) return;

    mouseMoveListener = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isCursorInContainer = isInContainer(mouseX, mouseY);

      if (isCursorInContainer && hasMovedEnough()) {
        lastMouseX = mouseX;
        lastMouseY = mouseY;
        createIcon();
      }
    };

    document.addEventListener("mousemove", mouseMoveListener);

    const animate = () => {
      removeOldIcons();
      animationId = requestAnimationFrame(animate);
    };
    animate();
  };

  const stopAnimation = () => {
    if (mouseMoveListener) {
      document.removeEventListener("mousemove", mouseMoveListener);
      mouseMoveListener = null;
    }

    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }

    trail.forEach((item) => {
      if (item.element.parentNode) {
        item.element.parentNode.removeChild(item.element);
      }
    });
    trail.length = 0;
  };

  const handleResize = () => {
    const wasDesktop = isDesktop;
    isDesktop = window.innerWidth > 1000;

    if (isDesktop && !wasDesktop) {
      startAnimation();
    } else if (!isDesktop && wasDesktop) {
      stopAnimation();
    }
  };

  window.addEventListener("resize", handleResize);

  if (isDesktop) {
    startAnimation();
  }
});
