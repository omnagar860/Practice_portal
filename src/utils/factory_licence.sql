CREATE TABLE factory_licence (
    factory_licence_id UNIQUEIDENTIFIER NOT NULL
        CONSTRAINT PK_factory_licence PRIMARY KEY DEFAULT NEWID(),

    user_id UNIQUEIDENTIFIER NOT NULL,

    -- ✅ Links this licence to a specific factory registration

    license_type VARCHAR(20) NOT NULL
        CONSTRAINT CK_license_type CHECK (license_type IN ('factory', 'boiler', 'combined')),

    requested_license_duration VARCHAR(10) NOT NULL
        CONSTRAINT CK_license_duration CHECK (requested_license_duration IN ('1_year', '3_year', '5_year')),

    applicant_designation VARCHAR(100) NOT NULL,

    declaration_accepted BIT NOT NULL
        CONSTRAINT CK_declaration CHECK (declaration_accepted = 1),

    fee_payment_reference VARCHAR(50) NOT NULL,

    affidavit_document VARCHAR(500) NOT NULL,
    photo_identity_document VARCHAR(500) NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CONSTRAINT CK_licence_status CHECK (status IN ('pending', 'approved', 'rejected')),

    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);