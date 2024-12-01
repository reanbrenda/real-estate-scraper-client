"use client";

import { useState } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export default function PropertyClient({ property }) {
    const [editedProperty, setEditedProperty] = useState({
        price: property.price,
        square_meters: property.square_meters,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        description: property.description,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedProperty((prev) => ({
            ...prev,
            [name]: name === "price" || name === "square_meters" || name === "bedrooms" || name === "bathrooms"
                ? Number(value)
                : value,
        }));
    };

    const handleSaveChanges = () => {
        console.log("Saved Property Details:", editedProperty);
    };

    const handleExportPDF = async () => {
        const pdfDoc = await PDFDocument.create();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const page = pdfDoc.addPage();
        const { width, height } = page.getSize();
        const fontSize = 12;

        const drawText = (text, x, y) => {
            page.drawText(text, { x, y, size: fontSize, font, color: rgb(0, 0, 0) });
        };

        drawText("Property Details", width / 2 - 50, height - 50, 16);
        drawText(`Reference: ${property.reference}`, 50, height - 100);
        drawText(`Category: ${property.category}`, 50, height - 120);
        drawText(`Region: ${property.region}`, 50, height - 140);
        drawText(`Price: $${editedProperty.price}`, 50, height - 160);
        drawText(`Square Meters: ${editedProperty.square_meters}`, 50, height - 180);
        drawText(`Bedrooms: ${editedProperty.bedrooms}`, 50, height - 200);
        drawText(`Bathrooms: ${editedProperty.bathrooms}`, 50, height - 220);

        const lines = editedProperty.description.split("\n");
        lines.forEach((line, index) => {
            drawText(line, 50, height - 240 - index * 14);
        });

        let yPosition = height - 300 - lines.length * 14;

        for (let i = 0; i < Math.min(property.photos.length, 3); i++) {
            const photoUrl = property.photos[i];
            try {
                const response = await fetch(photoUrl);
                const imageBytes = await response.arrayBuffer();
                const image = await pdfDoc.embedJpg(imageBytes);
                const imageHeight = 150;
                const imageWidth = image.width / (image.height / imageHeight);

                if (yPosition - imageHeight < 50) {
                    const newPage = pdfDoc.addPage();
                    yPosition = newPage.getHeight() - 50;
                }
                page.drawImage(image, {
                    x: 50,
                    y: yPosition - imageHeight,
                    width: imageWidth,
                    height: imageHeight,
                });
                yPosition -= imageHeight + 20;
            } catch (error) {
                console.error(`Failed to load image ${photoUrl}`, error);
            }
        }

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `property_${property.reference}.pdf`;
        link.click();
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
                <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Property Details</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Price</label>
                            <input
                                type="number"
                                name="price"
                                value={editedProperty.price}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Square Meters</label>
                            <input
                                type="number"
                                name="square_meters"
                                value={editedProperty.square_meters}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
                            <input
                                type="number"
                                name="bedrooms"
                                value={editedProperty.bedrooms}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Bathrooms</label>
                            <input
                                type="number"
                                name="bathrooms"
                                value={editedProperty.bathrooms}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                name="description"
                                value={editedProperty.description}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full p-3 border border-gray-300 rounded-lg"
                            />
                        </div>
                    </div>
                    <div className="mt-6 flex space-x-4">
                        <button
                            onClick={handleSaveChanges}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
                        >
                            Save Changes
                        </button>
                        <button
                            onClick={handleExportPDF}
                            className="bg-green-600 text-white px-6 py-3 rounded-lg"
                        >
                            Export to PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

