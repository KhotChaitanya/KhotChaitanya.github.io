document.addEventListener('DOMContentLoaded', function() {
    const projectsContainer = document.getElementById('projects-container');
    const username = 'KhotChaitanya';
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    // Mobile navigation toggle
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
    
    // Fetch GitHub repositories
    fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=25`)
        .then(response => response.json())
        .then(data => {
            // Clear skeleton loaders
            projectsContainer.innerHTML = '';
            
            // Filter out forks and empty repos
            const repos = data.filter(repo => !repo.fork && repo.description);
            
            repos.forEach(repo => {
                const projectCard = document.createElement('a');
                projectCard.className = 'project-card';
                projectCard.href = repo.html_url;
                projectCard.target = '_blank';
                
                // Languages mapping to colors
                const languageColors = {
                    'Python': '#3572A5',
                    'JavaScript': '#f1e05a',
                    'HTML': '#e34c26',
                    'CSS': '#563d7c',
                    'Java': '#b07219',
                    'C++': '#f34b7d',
                    'TypeScript': '#2b7489',
                    'Shell': '#89e051',
                    'PHP': '#4F5D95',
                    'Ruby': '#701516',
                    'C': '#555555',
                    'R': '#276DC3'
                };
                
                const languageColor = languageColors[repo.language] || '#00b8d4';
                
                // Use GitHub OpenGraph image for repo preview
                const repoImage = `https://opengraph.githubassets.com/1/${username}/${repo.name}`;
                
                // Create image element to check if it loads successfully
                const img = new Image();
                img.src = repoImage;
                
                projectCard.innerHTML = `
                    <div class="project-image" style="background-image: url('${repoImage}')">
                        <div class="image-overlay"></div>
                        <i class="fab fa-github"></i>
                    </div>
                    <div class="project-content">
                        <h3 class="project-title">${repo.name}</h3>
                        <p class="project-description">${repo.description || 'No description available.'}</p>
                        <div class="project-meta">
                            <div class="project-language">
                                <span class="language-dot" style="background-color: ${languageColor};"></span>
                                ${repo.language || 'Various'}
                            </div>
                            <div class="project-stars">
                                <i class="fas fa-star"></i> ${repo.stargazers_count}
                            </div>
                        </div>
                    </div>
                `;
                
                projectsContainer.appendChild(projectCard);
                
                // Check if image loaded successfully
                img.onerror = function() {
                    const imageDiv = projectCard.querySelector('.project-image');
                    imageDiv.style.backgroundImage = 'none';
                    imageDiv.style.backgroundColor = languageColor;
                    imageDiv.style.background = `linear-gradient(120deg, ${languageColor}, ${adjustColor(languageColor, 30)})`;
                };
            });
        })
        .catch(error => {
            console.error('Error fetching GitHub repositories:', error);
            projectsContainer.innerHTML = `
                <div class="error-message">
                    <p>Unable to load projects at this time. Please visit my 
                    <a href="https://github.com/KhotChaitanya" target="_blank">GitHub profile</a> 
                    to see my repositories.</p>
                </div>
            `;
        });
    
    // Helper function to adjust color brightness
    function adjustColor(hex, percent) {
        // If it's a named color, try to get the hex value
        if (!hex.startsWith('#')) {
            const tempDiv = document.createElement('div');
            tempDiv.style.color = hex;
            document.body.appendChild(tempDiv);
            hex = getComputedStyle(tempDiv).color;
            document.body.removeChild(tempDiv);
            
            // Convert RGB to hex
            if (hex.startsWith('rgb')) {
                const rgb = hex.match(/\d+/g);
                hex = `#${parseInt(rgb[0]).toString(16).padStart(2, '0')}${parseInt(rgb[1]).toString(16).padStart(2, '0')}${parseInt(rgb[2]).toString(16).padStart(2, '0')}`;
            }
        }
        
        // Remove # if present
        hex = hex.replace(/^#/, '');
        
        // Parse hex to RGB
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);
        
        // Adjust brightness
        r = Math.min(255, Math.max(0, r + r * percent / 100));
        g = Math.min(255, Math.max(0, g + g * percent / 100));
        b = Math.min(255, Math.max(0, b + b * percent / 100));
        
        // Convert back to hex
        r = Math.round(r).toString(16).padStart(2, '0');
        g = Math.round(g).toString(16).padStart(2, '0');
        b = Math.round(b).toString(16).padStart(2, '0');
        
        return `#${r}${g}${b}`;
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});