        let images = [];
        let currentImageIndex = 0;
        let currentCategory = 'nature';

        const categories = {
            nature: 'nature,landscape,forest,mountain,ocean,sky',
            architecture: 'architecture,building,city,urban,modern',
            technology: 'technology,computer,digital,futuristic,ai',
            people: 'people,portrait,human,lifestyle,culture',
            abstract: 'abstract,art,pattern,geometric,creative'
        };

        async function fetchImages(category) {
            const loading = document.querySelector('.loading');
            const gallery = document.getElementById('gallery');
            
            loading.style.display = 'block';
            gallery.innerHTML = '';

            try {
                // Using Unsplash API - you might want to get your own API key
                const response = await fetch(
                    `https://api.unsplash.com/search/photos?query=${categories[category]}&per_page=20&orientation=landscape&client_id=your_client_id_here`
                );

                // For demo purposes, we'll use a fallback with picsum photos
                // Replace with actual Unsplash API call when you have an API key
                const mockImages = [];
                for (let i = 1; i <= 20; i++) {
                    const randomId = Math.floor(Math.random() * 1000) + 1;
                    mockImages.push({
                        id: randomId,
                        urls: {
                            regular: `https://picsum.photos/400/300?random=${randomId + Date.now() + i}`,
                            full: `https://picsum.photos/800/600?random=${randomId + Date.now() + i}`
                        },
                        alt_description: `Beautiful ${category} image ${i}`,
                        user: {
                            name: `Photographer ${i}`,
                            username: `photographer${i}`
                        }
                    });
                }

                images = mockImages;
                displayImages();
            } catch (error) {
                console.error('Error fetching images:', error);
                gallery.innerHTML = '<p style="text-align: center; color: #888;">Failed to load images. Please try again.</p>';
            } finally {
                loading.style.display = 'none';
            }
        }

        function displayImages() {
            const gallery = document.getElementById('gallery');
            gallery.innerHTML = '';

            images.forEach((image, index) => {
                const card = document.createElement('div');
                card.className = 'image-card';
                card.innerHTML = `
                    <img src="${image.urls.regular}" alt="${image.alt_description || 'Gallery image'}" loading="lazy">
                    <div class="image-overlay">
                        <div class="image-title">${image.alt_description || 'Untitled'}</div>
                        <div class="image-author">by ${image.user.name}</div>
                    </div>
                `;
                
                card.addEventListener('click', () => openLightbox(index));
                gallery.appendChild(card);
            });
        }

        function openLightbox(index) {
            currentImageIndex = index;
            const lightbox = document.getElementById('lightbox');
            const lightboxImg = document.getElementById('lightbox-img');
            const lightboxTitle = document.getElementById('lightbox-title');
            const lightboxAuthor = document.getElementById('lightbox-author');

            const image = images[index];
            lightboxImg.src = image.urls.full || image.urls.regular;
            lightboxTitle.textContent = image.alt_description || 'Untitled';
            lightboxAuthor.textContent = `by ${image.user.name}`;

            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            const lightbox = document.getElementById('lightbox');
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        function nextImage() {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            openLightbox(currentImageIndex);
        }

        function prevImage() {
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            openLightbox(currentImageIndex);
        }

        // Event listeners
        document.addEventListener('keydown', (e) => {
            if (document.getElementById('lightbox').classList.contains('active')) {
                switch(e.key) {
                    case 'Escape':
                        closeLightbox();
                        break;
                    case 'ArrowRight':
                        nextImage();
                        break;
                    case 'ArrowLeft':
                        prevImage();
                        break;
                }
            }
        });

        document.getElementById('lightbox').addEventListener('click', (e) => {
            if (e.target.id === 'lightbox') {
                closeLightbox();
            }
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentCategory = btn.dataset.category;
                fetchImages(currentCategory);
            });
        });

        // Initialize gallery
        fetchImages(currentCategory);

        // Add some smooth scrolling
        window.addEventListener('scroll', () => {
            const cards = document.querySelectorAll('.image-card');
            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                
                if (isVisible) {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }
            });
        });
