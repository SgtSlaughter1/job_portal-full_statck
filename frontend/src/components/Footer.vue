<template>
    <footer class="footer">
        <div class="container d-flex flex-wrap justify-content-between">
            <div class="footer-links">
                <h4>Quick Links</h4>
                <a href="/about">About Us</a>
                <a href="/contact">Contact</a>
                <a href="/privacy">Privacy Policy</a>
                <a href="/terms">Terms of Service</a>
                <a href="/faq">FAQ</a>
            </div>
            <div class="customer-service">
                <h4>Customer Service</h4>
                <a href="/help">Help Center</a>
                <a href="/track-order">Track Application</a>
                <a href="/contact-support">Contact Support</a>
            </div>
            <div class="social-media">
                <h4>Follow Us</h4>
                <div class="social-icons">
                    <a href="#" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
                    <a href="#" aria-label="Twitter"><i class="bi bi-twitter"></i></a>
                    <a href="#" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
                    <a href="#" aria-label="LinkedIn"><i class="bi bi-linkedin"></i></a>
                </div>
            </div>
            <div class="newsletter">
                <h4>Subscribe</h4>
                <input type="email" placeholder="Your email address" />
                <button>Subscribe</button>
            </div>
        </div>
        <div class="footer-bottom text-center">
            <p>&copy; {{ currentYear }} Job Portal System. All rights reserved.</p>
        </div>
    </footer>
</template>

<script>
export default {
    data() {
        return {
            currentYear: new Date().getFullYear()
        };
    }
};
</script>

<style scoped>
.footer {
    background-color: #343a40;
    color: #ffffff;
    padding: 40px 20px;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
}

.footer-links, .customer-service, .social-media, .newsletter {
    flex: 1 1 200px;
    margin: 10px;
}

.footer-links a, .customer-service a, .social-media a {
    display: block;
    margin: 5px 0;
    text-decoration: none;
    color: #ffffff;
    transition: color 0.3s;
}

.footer-links a:hover, .customer-service a:hover, .social-media a:hover {
    color: #007bff;
}

.social-media {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.social-icons {
    display: flex;
    justify-content: center;
    margin: 5px 0;
}

.social-media i {
    font-size: 1.5rem;
    margin: 0 10px;
}

.newsletter {
    display: flex;
    flex-direction: column;
}

.newsletter input {
    padding: 10px;
    margin-bottom: 10px;
    border: none;
    border-radius: 5px;
}

.newsletter button {
    padding: 10px;
    background-color: #007bff;
    color: #ffffff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.newsletter button:hover {
    background-color: #0056b3;
}

.footer-bottom {
    margin-top: 20px;
    text-align: center;
    font-size: 0.9rem;
}
</style>