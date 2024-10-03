// const handleProductImagesChange = (e) => {
//   const files = Array.from(e.target.files).slice(0, 3); // Limit to 3 images
//   setProductImages(files);
// };

// image handle


// exports.getUserinfo = async (req, res) => {
//     const { id } = req.params;

//     try {
//         const [rows] = await pool.promise().query('SELECT * FROM users WHERE id = ?', [id]);

//         if (rows.length === 0) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         const user = rows[0]; // Assuming only one user is returned

//         // Convert the image buffer to a base64 string, if the image exists
//         if (user.image) {
//             const mimeType = 'image/jpeg'; // or 'image/png' depending on the image type stored
//             user.imageData = data:${mimeType};base64,${user.image.toString('base64')};
//         } else {
//             user.imageData = null; // Handle case when there is no image
//         }

//         res.status(200).json(user); // Return the user object with the imageData field
//     } catch (err) {
//         console.error("Error fetching user details:", err);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };