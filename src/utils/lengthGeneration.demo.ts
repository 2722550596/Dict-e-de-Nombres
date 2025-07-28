import {
    convertLength,
    generateLengthContent,
    getAvailableLengthUnits,
    getLengthContentHint,
    getLengthRangeConfig,
    isLengthContent,
    validateLengthAnswer,
    validateLengthAnswers
} from './lengthGeneration';

// Mock localStorage for demo
const mockLocalStorage = {
    getItem: (key: string) => {
        if (key === 'selectedDictationLanguage') {
            return 'zh'; // Chinese
        }
        return null;
    }
};

// Replace localStorage for demo
(global as any).localStorage = mockLocalStorage;

console.log('=== Length Generation Demo ===\n');

// Demo 1: Generate length content in Chinese
console.log('1. Generating length content in Chinese:');
const chineseUnits = ['米', '厘米', '毫米'];
const chineseContent = generateLengthContent(chineseUnits, [1, 100], 5, 'zh-CN');
chineseContent.forEach((content, index) => {
    console.log(`   ${index + 1}. ${content.displayText} (value: ${content.value}, unit: ${content.unit})`);
    console.log(`      Accepted formats: ${content.acceptedFormats.slice(0, 3).join(', ')}...`);
});

console.log('\n2. Generating length content in English:');
const englishUnits = ['meter', 'centimeter', 'inch', 'foot'];
const englishContent = generateLengthContent(englishUnits, [1, 50], 3, 'en-US');
englishContent.forEach((content, index) => {
    console.log(`   ${index + 1}. ${content.displayText} (value: ${content.value}, unit: ${content.unit})`);
    console.log(`      Accepted formats: ${content.acceptedFormats.slice(0, 3).join(', ')}...`);
});

console.log('\n3. Generating length content in French:');
const frenchUnits = ['mètre', 'centimètre', 'millimètre'];
const frenchContent = generateLengthContent(frenchUnits, [0.1, 10], 3, 'fr-FR');
frenchContent.forEach((content, index) => {
    console.log(`   ${index + 1}. ${content.displayText} (value: ${content.value}, unit: ${content.unit})`);
    console.log(`      Accepted formats: ${content.acceptedFormats.slice(0, 3).join(', ')}...`);
});

// Demo 2: Validation testing
console.log('\n4. Testing answer validation:');
const testContent = chineseContent[0];
const testAnswers = [
    testContent.acceptedFormats[0], // Should be correct
    `${testContent.value}${testContent.unit}`, // Should be correct
    `${testContent.value + 1}${testContent.unit}`, // Should be incorrect
    'invalid answer' // Should be incorrect
];

testAnswers.forEach((answer, index) => {
    const isValid = validateLengthAnswer(testContent, answer);
    console.log(`   Test ${index + 1}: "${answer}" -> ${isValid ? 'CORRECT' : 'INCORRECT'}`);
});

// Demo 3: Batch validation
console.log('\n5. Testing batch validation:');
const userAnswers = chineseContent.map(content => content.acceptedFormats[0]);
userAnswers[1] = 'wrong answer'; // Make one answer wrong
const validationResults = validateLengthAnswers(chineseContent, userAnswers);
validationResults.forEach((result, index) => {
    console.log(`   Question ${index + 1}: ${result ? 'CORRECT' : 'INCORRECT'}`);
});

// Demo 4: Unit conversion
console.log('\n6. Testing unit conversion:');
const conversions = [
    { value: 100, from: '厘米', to: '米', lang: 'zh-CN' },
    { value: 1, from: '米', to: '毫米', lang: 'zh-CN' },
    { value: 1, from: 'foot', to: 'meter', lang: 'en-US' },
    { value: 12, from: 'inch', to: 'foot', lang: 'en-US' }
];

conversions.forEach(({ value, from, to, lang }) => {
    const result = convertLength(value, from, to, lang);
    console.log(`   ${value} ${from} = ${result} ${to}`);
});

// Demo 5: Available units for different languages
console.log('\n7. Available units by language:');
const languages = ['zh-CN', 'en-US', 'fr-FR', 'de-DE'];
languages.forEach(lang => {
    const units = getAvailableLengthUnits(lang);
    console.log(`   ${lang}: ${units.slice(0, 4).join(', ')}...`);
});

// Demo 6: Range configurations
console.log('\n8. Length range configurations:');
const configs = ['basic-metric', 'intermediate-metric', 'advanced-metric', 'mixed-units'];
configs.forEach(configName => {
    const config = getLengthRangeConfig(configName);
    console.log(`   ${configName}: range [${config.range[0]}, ${config.range[1]}], complexity: ${config.complexity}`);
    console.log(`      Units: ${config.units.slice(0, 3).join(', ')}...`);
});

// Demo 7: Hints
console.log('\n9. Content hints:');
const hintContent = chineseContent[0];
const hintLanguages = ['zh-CN', 'en-US', 'fr-FR'];
hintLanguages.forEach(lang => {
    const hint = getLengthContentHint(hintContent, lang);
    console.log(`   ${lang}: ${hint}`);
});

// Demo 8: Type guard
console.log('\n10. Type guard testing:');
const validObject = chineseContent[0];
const invalidObjects = [
    null,
    {},
    { value: 'invalid' },
    { value: 10, unit: '米', displayText: '10米' }, // missing acceptedFormats
    { value: 10, unit: '米', displayText: '10米', acceptedFormats: 'not an array' }
];

console.log(`   Valid object: ${isLengthContent(validObject)}`);
invalidObjects.forEach((obj, index) => {
    console.log(`   Invalid object ${index + 1}: ${isLengthContent(obj)}`);
});

console.log('\n=== Demo completed successfully! ===');