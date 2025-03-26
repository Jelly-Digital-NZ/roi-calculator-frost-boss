// validation.js

export function validateForm(formData, country = 'nz') {
    const errors = {};
    
    // Required fields validation
    if (!formData.cropType || formData.cropType === '') {
        errors.cropType = 'Please select a crop type';
    }
    
    if (!formData.cropYield || formData.cropYield <= 0) {
        errors.cropYield = 'Please enter a valid crop yield greater than 0';
    }
    
    if (formData.reductionPercent === undefined || formData.reductionPercent <= 0 || formData.reductionPercent > 100) {
        errors.reductionPercent = 'Please enter a valid reduction percentage between 0 and 100';
    }
    
    if (!formData.cropValue || formData.cropValue <= 0) {
        errors.cropValue = 'Please enter a valid crop value greater than 0';
    }
    
    if (!formData.dieselCost || formData.dieselCost <= 0) {
        errors.dieselCost = 'Please enter a valid diesel cost greater than 0';
    }
    
    if (!formData.runningHours || formData.runningHours <= 0) {
        errors.runningHours = 'Please enter valid running hours greater than 0';
    }
    
    if (!formData.protectedArea || formData.protectedArea <= 0) {
        errors.protectedArea = 'Please enter a valid protected area greater than 0';
    }
    
    if (formData.interestRate === undefined || formData.interestRate < 0 || formData.interestRate > 1) {
        errors.interestRate = 'Please enter a valid interest rate between 0 and 1 (e.g., 0.05 for 5%)';
    }
    
    // Contact information validation (if required)
    if (formData.email && !isValidEmail(formData.email)) {
        errors.email = 'Please enter a valid email address';
    }
    
    // Country-specific validations could be added here if needed
    if (country === 'au') {
        // Australia-specific validations
        // For example, different diesel price ranges
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

// Helper function to validate email format
function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

// Initialize form with default values based on country
export function getDefaultFormValues(country = 'nz') {
    const defaults = {
        nz: {
            cropType: 'Apples',
            cropYield: 60,
            reductionPercent: 30,
            cropValue: 1200,
            dieselCost: 2.2,
            runningHours: 10,
            protectedArea: 24,
            interestRate: 0.1
        },
        au: {
            cropType: 'Apples',
            cropYield: 60,
            reductionPercent: 30,
            cropValue: 1200,
            dieselCost: 2.4, // Slightly different default for Australia
            runningHours: 10,
            protectedArea: 24,
            interestRate: 0.1
        }
    };
    
    return defaults[country.toLowerCase()] || defaults.nz;
}

// Helper function to generate form field IDs with country prefix
export function generateFieldId(fieldName, country = 'nz') {
    return `${country.toLowerCase()}-${fieldName}`;
}
