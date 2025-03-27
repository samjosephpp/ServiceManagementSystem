
const companyData = [
    {
        name: "SPfinder",
        code: "SPF001",
        description: "Service Provider Finder",
        enabled: true
    }
]

const stateData = [
    {
        name: "Default State",
        code: "ST001",
        description: "Default state"
    }
]

const locationData = [
    {
        name: "Default Location",
        isActive: true,
        stateId: "67d9e6ad1a7a9f2abf7df7ea",
        pincode: "000",
        code: "L001"
    }
]

const roleData = [
    {
        name: "Admin",
        description: "Admin",
        enabled: true
    },
    {
        name: "Client",
        description: "Client",
        enabled: true
    },
    {
        name: "ServiceProvider",
        description: "ServiceProvider",
        enabled: true
    }
]

const usersData = [
    {
        name: "user",
        email: "user@sa.com",
        password: "123456789",
        role: "67d9e9d91a7a9f2abf7df7f9",
        stateId: "67d9e6ad1a7a9f2abf7df7ea",
        locationId: "67d9e73d1a7a9f2abf7df7ef"
    },
    {
        name: "admin",
        email: "admin@sa.com",
        password: "123456789",
        role: "67d9e9d91a7a9f2abf7df7f8",
        stateId: "67d9e6ad1a7a9f2abf7df7ea",
        locationId: "67d9e73d1a7a9f2abf7df7ef"
    },
    {
        name: "sp",
        email: "sp@sa.com",
        password: "123456789",
        role: "67d9e9d91a7a9f2abf7df7fa",
        stateId: "67d9e6ad1a7a9f2abf7df7ea",
        locationId: "67d9e73d1a7a9f2abf7df7ef"
    }
]

module.exports = { usersData, companyData, stateData, locationData };