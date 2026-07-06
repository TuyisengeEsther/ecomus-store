## Known Limitations

The Products API currently returns empty `images` and `variants` arrays for products. Because the Cart API requires a `variantId`, full cart synchronization and checkout may fail until backend product variants are available. The frontend includes cart UI and API integration, but this backend data limitation is documented here as required by the assignment.
