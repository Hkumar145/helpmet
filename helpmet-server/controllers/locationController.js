const { Location } = require("../models/schemas");

// Create a new location under a specific company
exports.createLocation = async (req, res) => {
    const { id: companyID } = req.params;
    const { locationName, coordinates } = req.body;
    try {
        // Validate input
        if (!locationName) {
            return res.status(400).json({ message: "Location name is required" });
        }
        if (!coordinates || coordinates.length !== 2) {
            return res.status(400).json({ message: "Coordinates are required" });
        }

        const existingLocation = await Location.findOne({ locationName });
        if (existingLocation) {
            return res.status(400).json({ message: "Location with this name already exists" });
        }

        const LocationCount = await Location.countDocuments();
        const nextLocationNumber = LocationCount + 1;
        // Create a new location
        const newLocation = new Location({
            locationID: `L${nextLocationNumber.toString().padStart(4, "0")}`,
            locationName: locationName,
            companyID,
            location: { type: "Point", coordinates }
        });
        await newLocation.save();
        res.json({ message: "Location created successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all locations for a specific company by companyID
exports.getLocationsByCompany = async (req, res) => {
    const { id: companyID } = req.params;
    try {
        const locations = await Location.find({ companyID });
        if (locations.length === 0) {
            return res.status(404).json({ message: "No locations found for this company" });
        }
        res.json(locations.map(loc => ({
            locationID: loc.locationID,
            locationName: loc.locationName,
            coordinates: loc.location.coordinate,
            companyID: loc.companyID,
            managerID: loc.managerID,
        })));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get specific location details by locationID
exports.getLocationByID = async (req, res) => {
    try {
        const location = await Location.findOne({ locationID: req.params.id });
        if (!location) {
            return res.status(404).json({ message: "Location not found" });
        }
        res.json({
            locationID: location.locationID,
            locationName: location.locationName,
            companyID: location.companyID,
            coordinates: location.location.coordinates,
            managerID: location.managerID,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a location's details by locationID
exports.updateLocationByID = async (req, res) => {
    const { locationName, coordinates } = req.body;
    try {
        const updateFields = {};
        if (locationName) updateFields.locationName = locationName;
        if (coordinates && coordinates.length === 2) {
            updateFields.location = { type: "Point", coordinates };
        }
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: "No fields to update" });
        }

        const updatedLocation = await Location.findOneAndUpdate(
            { locationID: req.params.id },
            { $set: updateFields },
            { new: true }
        );

        if (!updatedLocation) {
            return res.status(404).json({ message: "Location not found" });
        }
        res.json({ message: "Location updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a location by locationID
exports.deleteLocationByID = async (req, res) => {
    try {
        const deletedLocation = await Location.findOneAndDelete({ locationID: req.params.id });
        if (!deletedLocation) {
            return res.status(404).json({ message: "Location not found" });
        }
        res.json({ message: "Location successfully deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};