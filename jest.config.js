module.exports = {
    roots: ['<rootDir>/src'],
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
        '^.+\\.tsx?$': 'ts-jest',
    },
    globals: {
        'ts-jest': {
            'babelConfig': true,
            'tsconfig': 'tsconfig.json'
        }
    },
    setupFilesAfterEnv: [
        '<rootDir>/jest-configs/setup-tests.js',
    ],
    moduleNameMapper: {
        '@/(.*)$': '<rootDir>/src/$1',
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/jest-configs/no-parser-stub.js',
        '\\.(css|scss)$': '<rootDir>/jest-configs/no-parser-stub.js',
    },
    // Module file extensions for importing
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};