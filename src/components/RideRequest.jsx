import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRideSocket } from "../hooks/useRideSocket";
import { GoogleMap, Marker, Circle, DirectionsRenderer, useLoadScript } from "@react-google-maps/api";

import { FaCarSide, FaCheckCircle, FaExclamationCircle, FaTimes, FaMapMarkerAlt, FaGripLines } from "react-icons/fa";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const containerStyle = { width: "100%", height: "100%" };

const RideRequest = () => {
    const { user, token } = useAuth();
    const [directions, setDirections] = useState(null);

    const [position, setPosition] = useState(null);
    const [destination, setDestination] = useState(null);
    const [placeName, setPlaceName] = useState("");
    const [distance, setDistance] = useState(null);
    const [fare, setFare] = useState(null);
    const [ride, setRide] = useState(null);
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(null);
    const [showSheet, setShowSheet] = useState(false);
    const [sheetHeight, setSheetHeight] = useState(300);
    const [dragging, setDragging] = useState(false);
    const sheetRef = useRef(null);

    // ✅ Use custom hook for socket
    const { connected, requestRide } = useRideSocket(token, user, setRide, setMessage, setSuccess, setShowSheet);

    const { isLoaded } = useLoadScript({ googleMapsApiKey: GOOGLE_MAPS_API_KEY });
    useEffect(() => {
        if (!position || !destination) return;

        const directionsService = new window.google.maps.DirectionsService();

        directionsService.route(
            {
                origin: position,
                destination: destination,
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === "OK" && result) {
                    setDirections(result);
                    const route = result.routes[0].legs[0];
                    setDistance(route.distance.text.replace(" km", ""));
                    setFare((parseFloat(route.distance.text.replace(" km", "")) * 2.5).toFixed(2));
                    setShowSheet(true);
                } else {
                    console.error("Error fetching directions:", result);
                }
            }
        );
    }, [destination]);

    // Get current location
    useEffect(() => {
        navigator.geolocation?.getCurrentPosition(
            (pos) => setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            (err) => console.error("Location error:", err)
        );
    }, []);

    const haversine = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) ** 2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    useEffect(() => {
        if (!position || !destination) return;
        const dist = haversine(position.lat, position.lng, destination.lat, destination.lng);
        setDistance(dist.toFixed(2));
        setFare((dist * 2.5).toFixed(2));
        setShowSheet(true);
    }, [destination]);

    const handleMapClick = (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setDestination({ lat, lng });
        setPlaceName("Dropped Pin");
    };

    const handleRequestRide = () => {
        if (!position || !destination) return;
        const rideData = {
            passengerId: user._id,
            from: position,
            to: destination,
            distance,
            fare,
            status: "requested",
            dropName: placeName,
        };
        requestRide(rideData);
        setRide(rideData);
        setMessage("✅ Ride requested successfully!");
        setSuccess(true);
    };


    const resetRide = () => {
        setRide(null);
        setDestination(null);
        setShowSheet(false);
        setPlaceName("");
    };

    // Drag handlers
    const startDrag = (e) => {
        setDragging(true);
        const startY = e.touches ? e.touches[0].clientY : e.clientY;
        const startHeight = sheetHeight;

        const onMove = (moveEvent) => {
            const currentY = moveEvent.touches ? moveEvent.touches[0].clientY : moveEvent.clientY;
            const diff = startY - currentY;
            let newHeight = startHeight + diff;
            newHeight = Math.min(Math.max(newHeight, 150), window.innerHeight - 100);
            setSheetHeight(newHeight);
        };

        const endDrag = () => {
            setDragging(false);
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", endDrag);
            window.removeEventListener("touchmove", onMove);
            window.removeEventListener("touchend", endDrag);
        };

        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", endDrag);
        window.addEventListener("touchmove", onMove);
        window.addEventListener("touchend", endDrag);
    };

    if (!isLoaded || !position) return <div>Loading map...</div>;

    return (
        <div className="h-screen w-full relative bg-gray-100">
            {/* Search input */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 w-11/12 sm:w-3/4 flex gap-2">
                <input
                    type="text"
                    placeholder="Enter drop-off place name"
                    value={placeName}
                    onChange={(e) => setPlaceName(e.target.value)}
                    className="flex-1 p-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                />
            </div>

            {/* Google Map */}
            <GoogleMap mapContainerStyle={containerStyle} center={position} zoom={15} onClick={handleMapClick}>
                <Circle
                    center={position}
                    radius={50}
                    options={{
                        strokeColor: "#34D399",
                        strokeOpacity: 0.5,
                        strokeWeight: 2,
                        fillColor: "#34D399",
                        fillOpacity: 0.2,
                        clickable: false,
                        zIndex: 1,
                    }}
                />
                <Marker
                    position={position}
                    icon={{
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 8,
                        fillColor: "#10B981",
                        fillOpacity: 1,
                        strokeWeight: 2,
                        strokeColor: "#ffffff",
                    }}
                />
                {destination && directions && (
                    <DirectionsRenderer
                        directions={directions}
                        options={{
                            suppressMarkers: true,
                            polylineOptions: {
                                strokeColor: "#10B981",
                                strokeWeight: 5,
                            },
                        }}
                    />
                )}

                ,
            </GoogleMap>

            {/* Bottom Sheet */}
            {showSheet && (
                <div
                    ref={sheetRef}
                    style={{ height: sheetHeight }}
                    className="absolute bottom-0 w-full bg-white p-4 rounded-t-3xl shadow-xl transition-all duration-200"
                >
                    {/* Drag handle */}
                    <div
                        className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-3 cursor-grab"
                        onMouseDown={startDrag}
                        onTouchStart={startDrag}
                    >
                        <FaGripLines className="w-full h-full text-gray-500" />
                    </div>

                    {!ride ? (
                        <>
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-lg font-semibold">Confirm Drop-off</h2>
                                <button onClick={() => setShowSheet(false)} className="text-gray-500 hover:text-gray-700">
                                    <FaTimes />
                                </button>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                                <FaMapMarkerAlt className="text-red-500" />
                                <p><strong>Drop-off:</strong> {placeName}</p>
                            </div>
                            <p className="mb-1"><strong>Distance:</strong> {distance} km</p>
                            <p className="mb-3"><strong>Fare:</strong> ${fare + "ETB"}</p>
                            <button
                                onClick={handleRequestRide}
                                className="w-full bg-green-500 text-white py-3 rounded-xl shadow-md hover:bg-green-600 transition"
                            >
                                Book Now
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-lg font-semibold">Ride Status</h2>
                                {ride.status === "trip_completed" ? (
                                    <button onClick={resetRide} className="text-green-600 font-bold">Done</button>
                                ) : (
                                    <button disabled className="text-gray-400 cursor-not-allowed">In Progress</button>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                <FaCarSide className={`text-2xl ${ride.status === "trip_completed" ? "text-green-600" : "text-blue-500"}`} />
                                <div>
                                    <p><strong>Status:</strong> {ride.status.replace("_", " ")}</p>
                                    <p><strong>Fare:</strong> ${ride.fare}</p>
                                    <p><strong>Drop-off:</strong> {ride.dropName}</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Message */}
            {message && (
                <div className={`absolute top-20 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-xl text-center shadow-md ${success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {success ? <FaCheckCircle className="inline mr-1" /> : <FaExclamationCircle className="inline mr-1" />}
                    {message}
                </div>
            )}

            {/* Socket status */}
            <div className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-sm font-medium shadow-md ${connected ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {connected ? "Socket Connected" : "Disconnected"}
            </div>
        </div>
    );
};

export default RideRequest;
