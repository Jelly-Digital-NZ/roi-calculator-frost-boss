// validation.js

class ROIValidator {
    constructor() {
        // Define required fields and their validation rules
        this.validationRules = {
            cropType: {
                required: true,
                message: "Crop type is required",
                validate: (value) => value && value.trim().length > 0
            },
            cropYield: {
                required: true,
                message: "Annual crop yield must be greater than 0",
                validate: (value) => !isNaN(value) && value > 0
            },
            reductionPercent: {
                required: true,
                message: "Reduction percentage must be between 0 and 100",
                validate: (value) => !isNaN(value) && value >= 0 && value <= 100
            },
            cropValue: {
                required: true,
                message: "Crop value must be greater than 0",
                validate: (value) => !isNaN(value) && value > 0
            },
            dieselCost: {
                required: true,
                message: "Diesel cost must be greater than 0",
                validate: (value) => !isNaN(value) && value > 0
            },
            interestRate: {
                required: true,
                message: "Interest rate must be between 0 and 100",
                validate: (value) => !isNaN(value) && value >= 0 && value <= 100
            },
            runningHours: {
                required: true,
                message: "Running hours must be greater than 0",
                validate: (value) => !isNaN(value) && value >= 0
            },
            protectedArea: {
                required: true,
                message: "Protected area must be greater than 0",
                validate: (value) => !isNaN(value) && value > 0
            }
        };

        // Business logic validation rules
        this.businessRules = {
            minimumArea: 4, // Minimum area in hectares
            maximumArea: 100, // Maximum area in hectares
            maximumRunningHours: 250, // Maximum running hours per year
            minimumDieselCost: 0.5, // Minimum diesel cost per litre
            maximumDieselCost: 10, // Maximum diesel cost per litre
        };
    }

    // Validate all fields
    validateAll(data) {
        const errors = {};
        
        // Check each field against validation rules
        for (const [field, rules] of Object.entries(this.validationRules)) {
            const error = this.validateField(field, data[field]);
            if (error) {
                errors[field] = error;
            }
        }

        // Business logic validations
        const businessErrors = this.validateBusinessRules(data);
        Object.assign(errors, businessErrors);

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    // Validate single field
    validateField(fieldName, value) {
        const rules = this.validationRules[fieldName];
        if (!rules) return null;

        if (rules.required && (value === undefined || value === null || value === '')) {
            return rules.message;
        }

        if (rules.validate && !rules.validate(value)) {
            return rules.message;
        }

        return null;
    }

    // Validate business rules
    validateBusinessRules(data) {
        const errors = {};

        // Protected area validations
        if (data.protectedArea < this.businessRules.minimumArea) {
            errors.protectedArea = `Protected area must be at least ${this.businessRules.minimumArea} hectares`;
        }
        if (data.protectedArea > this.businessRules.maximumArea) {
            errors.protectedArea = `Protected area must not exceed ${this.businessRules.maximumArea} hectares`;
        }

        // Running hours validations
        if (data.runningHours > this.businessRules.maximumRunningHours) {
            errors.runningHours = `Running hours must not exceed ${this.businessRules.maximumRunningHours} hours per year`;
        }

        // Diesel cost validations
        if (data.dieselCost < this.businessRules.minimumDieselCost) {
            errors.dieselCost = `Diesel cost must be at least $${this.businessRules.minimumDieselCost} per litre`;
        }
        if (data.dieselCost > this.businessRules.maximumDieselCost) {
            errors.dieselCost = `Diesel cost must not exceed $${this.businessRules.maximumDieselCost} per litre`;
        }

        // Crop specific validations (if crop data is available)
        if (data.cropType && this.cropData && this.cropData[data.cropType]) {
            const cropSpecificRules = this.cropData[data.cropType];
            // Add any crop-specific validations here
        }

        return errors;
    }

    // Format validation errors for display
    formatErrors(errors) {
        return Object.entries(errors).map(([field, message]) => ({
            field,
            message
        }));
    }
}

// Helper functions for specific validations
const validators = {
    isPositiveNumber: (value) => !isNaN(value) && value > 0,
    isPercentage: (value) => !isNaN(value) && value >= 0 && value <= 100,
    isEmail: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    isNotEmpty: (value) => value && value.trim().length > 0
};

export { ROIValidator, validators };
