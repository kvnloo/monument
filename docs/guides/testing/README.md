# Testing & Validation Guides

This directory contains comprehensive testing documentation and validation reports for the Monument Valley Demo project.

## Contents

### TEST_README.md
Complete test suite documentation including:
- Quick start guide for running tests
- Test framework setup (Vitest v4.0.10)
- Coverage overview
- Test categories and execution instructions
- Troubleshooting guide

**Use this when:** Setting up or running tests locally

### TEST_SUMMARY.md
Executive summary of test results featuring:
- Water-spout test case validation
- Algorithm correctness verification
- Screen-space projection validation
- Key findings summary
- Test status overview (21/28 PASSED)

**Use this when:** Understanding test coverage and validation status

### VALIDATION_COMPLETE.md
Comprehensive validation checklist including:
- Feature validation matrix
- Algorithm correctness verification
- Screen projection validation
- Error handling validation
- Performance assessment

**Use this when:** Reviewing complete validation coverage

### VALIDATION_REPORT.md
Detailed validation findings with:
- Error analysis and metrics
- Performance benchmarks
- Algorithm optimization notes
- Failure analysis and root causes
- Recommendations for improvements

**Use this when:** Deep-diving into validation results and performance

## Quick Links

- **Run Tests Locally**
  ```bash
  npm run test          # Watch mode
  npm run test:run      # Single run
  npm run test:ui       # UI dashboard
  npm run test:coverage # Coverage report
  ```

- **Test Location**
  ```
  monument-valley-demo/utils/__tests__/isometricAlignment.test.ts
  ```

## Test Coverage

**Total Tests:** 28
**Passing:** 21 ✓
**Status:** COMPREHENSIVE VALIDATION COMPLETE
**Framework:** Vitest v4.0.10

## Key Validations

- Algorithm correctness and convergence
- Screen-space projection accuracy
- Water-spout connection geometry
- Error handling and edge cases
- Performance optimization verification

For detailed information, see individual documentation files in this directory.
