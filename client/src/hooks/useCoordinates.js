import { useState } from "react";
import axios from "axios";

// Get API key from environment
const API_KEY = import.meta.env.VITE_GEOAPIKEY;

// Custom hook for GPS coordinates and reverse geocoding
export const useGPSCoordinates = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getGPSLocation = async () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            setLoading(true);
            const { latitude, longitude } = position.coords;
            
            console.log("GPS Coordinates obtained:", { latitude, longitude });
            console.log("GPS Accuracy:", position.coords.accuracy, "meters");
            
            // Get address from coordinates using Geoapify
            const result = await axios.get(
              `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${API_KEY}`
            );
            
            const addressData = result?.data?.results?.[0];
            if (addressData) {
              const address = {
                street: addressData.address_line1 || "",
                city: addressData.city || "",
                state: addressData.state || "",
                pincode: addressData.postcode || ""
              };
              
              console.log("Reverse geocoded address:", address);
              
              resolve({
                coordinates: { lat: latitude, lng: longitude },
                address
              });
            } else {
              reject(new Error("Unable to get address from your location"));
            }
          } catch (error) {
            console.error("Reverse geocoding error:", error);
            reject(new Error("Failed to get address from coordinates"));
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          setLoading(false);
          console.error("GPS Error:", error);
          
          let errorMessage = "Unable to get your location.";
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location permission denied. Please enable location access in your browser settings.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable. Please try again.";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out. Please try again.";
              break;
            default:
              errorMessage = "Unknown error occurred while getting location.";
              break;
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,  // Use GPS if available
          timeout: 10000,           // Wait 10 seconds
          maximumAge: 0             // Don't use cached position
        }
      );
    });
  };

  return { getGPSLocation, loading, error };
};

// Custom hook for address-based coordinate fetching
export const useAddressCoordinates = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getCoordinatesFromAddress = async (address) => {
    const { street, city, state, pincode } = address;
    const fullAddress = `${street}, ${city}, ${state} ${pincode}`;
    
    try {
      setLoading(true);
      setError("");
      
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(fullAddress)}&apiKey=${API_KEY}`
      );
      
      const feature = result.data.features?.[0];
      if (feature) {
        const { lat, lon } = feature.properties;
        return { lat, lng: lon };
      } else {
        throw new Error("Address not found. Please check the address and try again.");
      }
    } catch (error) {
      const errorMessage = error.response?.status === 401 
        ? "Invalid API key for geocoding service" 
        : "Unable to get coordinates for this address";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { getCoordinatesFromAddress, loading, error };
};
