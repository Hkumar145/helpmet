// const { Location } = require("../models/schemas");

// // Create a new location under a specific company
// exports.createLocation = async (req, res) => {
//     const { id: companyID } = req.params;
//     const { locationName, coordinates, managerID } = req.body;
//     try {
//         console.log(req.body);
//         console.log("params",req.params);

//         // Validate input
//         // if (!locationName) {
//         //     return res.status(400).json({ message: "Location name is required" });
//         // }
//         // if (!coordinates || coordinates.length !== 2) {
//         //     return res.status(400).json({ message: "Coordinates are required" });
//         // }

//         // const existingLocation = await Location.findOne({ locationName });
//         // console.log(existingLocation)
//         // if (existingLocation) {
//         //     return res.status(400).json({ message: "Location with this name already exists" });
//         // }


//         const LocationCount = await Location.countDocuments();
//         console.log(LocationCount);
//         const nextLocationNumber = LocationCount + 1;
//         // Create a new location
//         // const newLocation = new Location({
//         //     locationID: `L${nextLocationNumber.toString().padStart(4, "0")}`,
//         //     locationName: locationName,
//         //     companyID,
//         //     location: { type: "Point", coordinates }
//         // });
//         const newLocation = new Location({
//             locationID: `L${nextLocationNumber.toString().padStart(4, "0")}`,
//             locationName: locationName,
//             companyID,
//             managerID : managerID,
//             location: { type: "Point", coordinates}
//         });
//         newLocation.save();
//         res.json({ message: "Location created successfully" });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // Get all locations for a specific company by companyID
// exports.getLocationsByCompany = async (req, res) => {
//     const { id: companyID } = req.params;
//     try {
//         const locations = await Location.find({ companyID });
//         if (locations.length === 0) {
//             return res.status(404).json({ message: "No locations found for this company" });
//         }
//         res.json(locations.map(loc => ({
//             locationID: loc.locationID,
//             locationName: loc.locationName,
//             coordinates: loc.location.coordinates
//         })));
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // Get specific location details by locationID
// exports.getLocationByID = async (req, res) => {
//     try {
//         const location = await Location.findOne({ locationID: req.params.id });
//         if (!location) {
//             return res.status(404).json({ message: "Location not found" });
//         }
//         res.json({
//             locationID: location.locationID,
//             locationName: location.locationName,
//             companyID: location.companyID,
//             coordinates: location.location.coordinates
//         });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // Update a location's details by locationID
// exports.updateLocationByID = async (req, res) => {
//     const { locationName, coordinates } = req.body;
//     try {
//         const updateFields = {};
//         if (locationName) updateFields.locationName = locationName;
//         if (coordinates && coordinates.length === 2) {
//             updateFields.location = { type: "Point", coordinates };
//         }
//         if (Object.keys(updateFields).length === 0) {
//             return res.status(400).json({ message: "No fields to update" });
//         }

//         const updatedLocation = await Location.findOneAndUpdate(
//             { locationID: req.params.id },
//             { $set: updateFields },
//             { new: true }
//         );

//         if (!updatedLocation) {
//             return res.status(404).json({ message: "Location not found" });
//         }
//         res.json({ message: "Location updated successfully" });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // Delete a location by locationID
// exports.deleteLocationByID = async (req, res) => {
//     try {
//         const deletedLocation = await Location.findOneAndDelete({ locationID: req.params.id });
//         if (!deletedLocation) {
//             return res.status(404).json({ message: "Location not found" });
//         }
//         res.json({ message: "Location successfully deleted" });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

const { Location } = require("../models/schemas");

// Create a new location under a specific company
exports.createLocation = async (req, res) => {
    const { id: companyID } = req.params;
    const { locationName, coordinates, managerID } = req.body;

    try {
        console.log(req.body);
        console.log("params", req.params);

        // Validate input
        if (!locationName) {
            return res.status(400).json({ message: "Location name is required" });
        }
        if (!coordinates || coordinates.length !== 2) {
            return res.status(400).json({ message: "Coordinates are required and should be in an array of 2 numbers" });
        }

        // Generate the next location number based on the current count of locations
        const LocationCount = await Location.countDocuments();
        const nextLocationNumber = LocationCount + 1;
        
        // Check if the generated locationID already exists, and regenerate if necessary
        let locationID = `L${nextLocationNumber.toString().padStart(4, "0")}`;
        let existingLocation = await Location.findOne({ locationID });

        // Keep generating a new locationID until it is unique
        while (existingLocation) {
            const LocationCount = await Location.countDocuments();
            const nextLocationNumber = LocationCount + 1;
            locationID = `L${nextLocationNumber.toString().padStart(4, "0")}`;
            existingLocation = await Location.findOne({ locationID });
        }

        // Create a new location
        const newLocation = new Location({
            locationID,
            locationName,
            companyID,
            managerID,
            location: { type: "Point", coordinates }
        });

        // Save the location and await the result
        await newLocation.save();

        res.json({ message: "Location created successfully" });
    } catch (error) {
        console.error("Error during location creation:", error);  // Log the error to the console
        res.status(500).json({ error: error.message });
    }
};

// Other route handlers remain the same...


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
            coordinates: loc.location.coordinates,
            managerID: loc.managerID
        })));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get specific location details by locationID
exports.getLocationByID = async (req, res) => {
    try {
        const location = await Location.findOne({ locationID: req.params.id })
            .populate({ path: 'managerID', select: 'firstName lastName' });

        if (!location) {
            return res.status(404).json({ message: "Location not found" });
        }

        res.json({
            locationID: location.locationID,
            locationName: location.locationName,
            companyID: location.companyID,
            coordinates: location.location.coordinates,
            managerName: location.managerID ? `${location.managerID.firstName} ${location.managerID.lastName}` : 'N/A'
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
