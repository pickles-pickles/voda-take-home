CREATE TABLE IF NOT EXISTS assets (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,

    type VARCHAR(20) NOT NULL
        CHECK (type IN ('pipe', 'hydrant', 'sensor', 'valve')),

    status VARCHAR(20) NOT NULL
        CHECK (status IN ('ok', 'warning', 'critical')),

    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,

    installed_at TIMESTAMP NOT NULL,
    last_inspected_at TIMESTAMP NULL,

    notes TEXT DEFAULT ''
);