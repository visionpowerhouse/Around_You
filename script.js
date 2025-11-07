// Mobile menu
function toggleMenu(){
  document.getElementById('navlinks').classList.toggle('open');
}

// Watch Preview button handler - just scrolls to video
document.getElementById('watchPreviewBtn').addEventListener('click', function(e){
  e.preventDefault();
  const phoneFrame = document.getElementById('phoneFrame');
  
  // Scroll to phone frame smoothly
  phoneFrame.scrollIntoView({behavior:'smooth', block:'center'});
});

// Smooth scroll for on‑page anchors
document.addEventListener('click', function(e){
  const a = e.target.closest('a[href^="#"]');
  if(!a || a.id === 'watchPreviewBtn') return;
  const id = a.getAttribute('href');
  if(id.length > 1){
    const el = document.querySelector(id);
    if(el){
      e.preventDefault();
      el.scrollIntoView({behavior:'smooth', block:'start'});
      history.replaceState(null, '', id);
    }
  }
});

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Smooth ticker auto-scroll - infinite carousel with no gaps
(function(){
  const ticker = document.getElementById('ticker');
  if(!ticker) return;
  const tickerContent = document.getElementById('tickerContent');
  if(!tickerContent) return;
  
  // Wait for DOM to be ready
  setTimeout(() => {
    const originalItems = Array.from(tickerContent.children);
    if(originalItems.length === 0) return;
    
    // Calculate dimensions
    const itemHeight = originalItems[0].offsetHeight || 48;
    const tickerHeight = ticker.offsetHeight;
    const visibleCount = Math.ceil(tickerHeight / itemHeight) || 3;
    
    // Ensure we have enough items to fill visible area + buffer
    const totalNeeded = visibleCount + 2;
    const repeatTimes = Math.ceil(totalNeeded / originalItems.length) + 1;
    
    // Clone items to create seamless loop
    for(let i = 0; i < repeatTimes; i++){
      originalItems.forEach(item => {
        const clone = item.cloneNode(true);
        tickerContent.appendChild(clone);
      });
    }
    
    let currentIndex = 0;
    const totalOriginalItems = originalItems.length;
    
    // Set transition style
    tickerContent.style.transition = 'transform 0.6s ease-in-out';
    
    function scrollNext(){
      currentIndex++;
      const translateY = currentIndex * itemHeight;
      
      // When we've scrolled through all original items, reset seamlessly
      if(currentIndex >= totalOriginalItems){
        currentIndex = 0;
        // Temporarily disable transition for instant reset
        tickerContent.style.transition = 'none';
        tickerContent.style.transform = 'translateY(0)';
        
        // Re-enable transition after reset
        requestAnimationFrame(() => {
          setTimeout(() => {
            tickerContent.style.transition = 'transform 0.6s ease-in-out';
          }, 50);
        });
      } else {
        tickerContent.style.transform = `translateY(-${translateY}px)`;
      }
    }
    
    // Start auto-scrolling
    setInterval(scrollNext, 2500);
  }, 200);
})();

// Reveal on scroll
const io = new IntersectionObserver((entries)=>{
  entries.forEach((e)=>{
    if(e.isIntersecting){
      e.target.animate([
        {opacity:0, transform:'translateY(18px)'},
        {opacity:1, transform:'translateY(0)'}
      ], {duration:500, easing:'ease-out', fill:'forwards'});
      io.unobserve(e.target);
    }
  })
}, {threshold:.12});
document.querySelectorAll('section .card, section h2, .feature').forEach(el=>io.observe(el));

