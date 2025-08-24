// Supabase Authentication for Saffron Naturals
// Replace these with your actual Supabase project credentials
const SUPABASE_URL = 'YOUR_SUPABASE_URL_HERE';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Saffron Naturals Supabase Auth System
class SaffronSupabaseAuth {
    constructor() {
        this.init();
    }
    
    async init() {
        console.log('🔐 Saffron Naturals Supabase Auth Initialized');
        
        // Check current authentication state
        const { data: { user } } = await supabase.auth.getUser();
        const currentPage = window.location.pathname;
        
        // Auto-redirect logic
        if ((currentPage.includes('index.html') || currentPage === '/') && user) {
            console.log('✅ User already logged in, redirecting to dashboard...');
            this.redirectToDashboard();
        }
        
        if (currentPage.includes('dashboard.html') && !user) {
            console.log('❌ User not logged in, redirecting to login...');
            this.redirectToLogin();
        }
        
        // Listen for auth state changes
        supabase.auth.onAuthStateChange((event, session) => {
            console.log('🔄 Auth state changed:', event, session);
            
            if (event === 'SIGNED_IN') {
                console.log('✅ User signed in successfully');
                this.redirectToDashboard();
            } else if (event === 'SIGNED_OUT') {
                console.log('👋 User signed out');
                this.redirectToLogin();
            }
        });
    }
    
    async login(email, password) {
        console.log(`🔍 Attempting Supabase login for: ${email}`);
        
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });
            
            if (error) {
                console.log('❌ Supabase login failed:', error.message);
                return { 
                    success: false, 
                    message: error.message || 'Login failed. Please check your credentials.' 
                };
            }
            
            console.log('✅ Supabase login successful:', data);
            return { 
                success: true, 
                user: data.user,
                session: data.session 
            };
            
        } catch (error) {
            console.error('❌ Login error:', error);
            return { 
                success: false, 
                message: 'An unexpected error occurred. Please try again.' 
            };
        }
    }
    
    async logout() {
        console.log('👋 Logging out from Supabase...');
        
        try {
            const { error } = await supabase.auth.signOut();
            
            if (error) {
                console.error('❌ Logout error:', error);
                alert('Error logging out. Please try again.');
                return;
            }
            
            console.log('✅ Successfully logged out');
            this.redirectToLogin();
            
        } catch (error) {
            console.error('❌ Logout error:', error);
            alert('Error logging out. Please try again.');
        }
    }
    
    async getCurrentUser() {
        try {
            const { data: { user }, error } = await supabase.auth.getUser();
            
            if (error) {
                console.error('❌ Error getting user:', error);
                return null;
            }
            
            return user;
        } catch (error) {
            console.error('❌ Error getting user:', error);
            return null;
        }
    }
    
    async isLoggedIn() {
        const user = await this.getCurrentUser();
        return !!user;
    }
    
    redirectToDashboard() {
        console.log('🚀 Redirecting to dashboard...');
        window.location.href = 'dashboard.html';
    }
    
    redirectToLogin() {
        console.log('🔒 Redirecting to login...');
        window.location.href = 'index.html';
    }
    
    // Optional: Sign up new users
    async signUp(email, password, userData = {}) {
        console.log(`📝 Attempting Supabase signup for: ${email}`);
        
        try {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: userData
                }
            });
            
            if (error) {
                console.log('❌ Supabase signup failed:', error.message);
                return { success: false, message: error.message };
            }
            
            console.log('✅ Supabase signup successful:', data);
            return { success: true, user: data.user };
            
        } catch (error) {
            console.error('❌ Signup error:', error);
            return { success: false, message: 'Signup failed. Please try again.' };
        }
    }
    
    // Optional: Reset password
    async resetPassword(email) {
        console.log(`🔄 Sending password reset for: ${email}`);
        
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password.html`,
            });
            
            if (error) {
                console.log('❌ Password reset failed:', error.message);
                return { success: false, message: error.message };
            }
            
            console.log('✅ Password reset email sent');
            return { success: true, message: 'Password reset email sent!' };
            
        } catch (error) {
            console.error('❌ Password reset error:', error);
            return { success: false, message: 'Failed to send reset email.' };
        }
    }
}

// Initialize Supabase authentication
const supabaseAuth = new SaffronSupabaseAuth();

// Updated login handler for Supabase
async function handleLogin(event) {
    event.preventDefault();
    console.log('📝 Processing Supabase login form...');
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
        alert('❌ Please enter both email and password');
        return;
    }
    
    // Show loading state
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '🔄 Signing In...';
    submitButton.disabled = true;
    
    try {
        const result = await supabaseAuth.login(email, password);
        
        if (result.success) {
            alert(`🎉 LOGIN SUCCESSFUL!\n\nWelcome to Saffron Naturals!\n\n✅ Authentication successful\n✅ Redirecting to your dashboard...\n\nEnjoy exploring our export portal!`);
            
            // Redirect will happen automatically via auth state change
        } else {
            alert(`❌ LOGIN FAILED\n\n${result.message}\n\n💡 Please check your credentials and try again.\n\nIf you don't have an account, please contact our team to set up your export account.`);
        }
    } catch (error) {
        console.error('❌ Login error:', error);
        alert('❌ An unexpected error occurred. Please try again.');
    } finally {
        // Restore button state
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
}

// Updated logout handler for Supabase
async function handleLogout() {
    if (confirm('🚪 Are you sure you want to logout?\n\nYou will be redirected to the login page.')) {
        const user = await supabaseAuth.getCurrentUser();
        const userName = user ? user.email : 'User';
        
        alert(`👋 Logging out...\n\nThank you ${userName} for using Saffron Naturals!\n\nSee you again soon! 🌟`);
        
        setTimeout(async () => {
            await supabaseAuth.logout();
        }, 1000);
    }
}

// Utility function to check if Supabase is properly configured
function checkSupabaseConfig() {
    if (SUPABASE_URL === 'YOUR_SUPABASE_URL_HERE' || SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY_HERE') {
        console.warn('⚠️ Supabase not configured. Please update SUPABASE_URL and SUPABASE_ANON_KEY in supabase-auth.js');
        return false;
    }
    return true;
}

// Check configuration on load
document.addEventListener('DOMContentLoaded', function() {
    if (!checkSupabaseConfig()) {
        alert('⚠️ Supabase configuration required!\n\nPlease update your Supabase credentials in supabase-auth.js file.');
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { supabaseAuth, handleLogin, handleLogout, supabase };
}
