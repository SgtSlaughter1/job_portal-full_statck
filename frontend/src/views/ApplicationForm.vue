<template>
    <div class="application-form">
        <h2>Application Form</h2>
        <div class="card">
            <form @submit.prevent="submitApplication">
                <div class="form-group">
                    <label for="fullName">Full Name:</label>
                    <input type="text" id="fullName" v-model="form.fullName" required />
                </div>
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" v-model="form.email" required />
                </div>
                <div class="form-group">
                    <label for="phone">Phone:</label>
                    <input type="tel" id="phone" v-model="form.phone" required />
                </div>
                <div class="form-group">
                    <label for="resume">Resume (URL):</label>
                    <input type="url" id="resume" v-model="form.resume" required />
                </div>
                <div class="form-group">
                    <label for="coverLetter">Cover Letter:</label>
                    <textarea id="coverLetter" v-model="form.coverLetter" required></textarea>
                </div>
                <button type="submit" class="btn-submit">Submit Application</button>
            </form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            form: {
                fullName: '',
                email: '',
                phone: '',
                resume: '',
                coverLetter: ''
            }
        };
    },
    methods: {
        submitApplication() {
            console.log('Application submitted:', this.form);
            alert('Application submitted successfully!');
            this.$router.push('/jobs'); // Redirect back to jobs page after submission
        }
    }
}
</script>

<style scoped>
.application-form {
    max-width: 600px;
    margin: 2rem auto;
    padding: 1.5rem;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: #fff;
}

.card {
    padding: 1.5rem;
    border-radius: 10px;
}

.form-group {
    margin-bottom: 1.5rem;
}

label {
    font-weight: bold;
    margin-bottom: 0.5rem;
    display: block;
}

input[type="text"],
input[type="email"],
input[type="tel"],
input[type="url"],
textarea {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1rem;
}


input[type="text"]:focus,
input[type="email"]:focus,
input[type="tel"]:focus,
input[type="url"]:focus,
textarea:focus {
    border-color: #007bff;
    outline: none;
}

textarea {
    height: 100px;
    resize: none;
}

.btn-submit {
    background-color: #007bff;
    color: white;
    padding: 0.75rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s;
}

.btn-submit:hover {
    background-color: #0056b3;
}
</style>