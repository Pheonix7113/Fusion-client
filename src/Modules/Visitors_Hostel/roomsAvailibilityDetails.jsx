import React, { useState, useEffect } from "react";
import { MantineProvider, Grid, Button, Box, Text } from "@mantine/core";
import axios from "axios";
import PropTypes from "prop-types";

function RoomsDetails({ bookingFrom, bookingTo }) {
  const [availableRooms, setAvailableRooms] = useState([]);
  const [partialBookingData, setPartialBookingData] = useState([]);

  const roomData = {
    G: ["G01", "G02", "G03", "G04", "G05", "G06", "G07", "G08", "G09", "G10"],
    F: [
      "F01",
      "F02",
      "F03",
      "F04",
      "F05",
      "F06",
      "F07",
      "F08",
      "F09",
      "F10",
      "F11",
      "F12",
    ],
    S: ["S01", "S02", "S03", "S04", "S05", "S06"],
    T: ["T01", "T02", "T03", "T04", "T05", "T06", "T07", "T08"],
  };

  useEffect(() => {
    const fetchAvailableRooms = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return console.error("No authentication token found!");
      }

      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/visitorhostel/room_availabity_new/",
          {
            start_date: bookingFrom,
            end_date: bookingTo,
          },
          {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
        setAvailableRooms(response.data.available_rooms);
      } catch (error) {
        console.error("Error fetching available rooms:", error);
      }
    };

    const fetchPartialBookingData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return console.error("No authentication token found!");
      }

      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/visitorhostel/check-partial-booking/",
          {
            start_date: bookingFrom,
            end_date: bookingTo,
          },
          {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
        setPartialBookingData(response.data);
      } catch (error) {
        console.error("Error fetching partial booking data:", error);
      }
    };

    if (bookingFrom && bookingTo) {
      fetchAvailableRooms();
      fetchPartialBookingData();
    }
  }, [bookingFrom, bookingTo]);

  const filteredPartialBookingData = partialBookingData.filter(
    (data) => data.available_ranges && data.available_ranges.length > 0,
  );

  return (
    <MantineProvider theme={{ fontFamily: "Arial, sans-serif" }}>
      <Box>
        {Object.keys(roomData).map((section) => (
          <Grid
            key={section}
            style={{ marginBottom: "10px", marginTop: "10px" }}
          >
            {roomData[section].map((room) => (
              <Grid.Col span="auto" key={room} style={{ textAlign: "center" }}>
                <Button
                  variant="filled"
                  color={availableRooms.includes(room) ? "green" : "red"}
                  style={{ width: "64px" }}
                >
                  {room}
                </Button>
              </Grid.Col>
            ))}
          </Grid>
        ))}
      </Box>

      <Box mt="xl">
        <Text size="xl" weight={700} mb="md" style={{ fontWeight: "bold" }}>
          Partial Booking Availability
        </Text>
        {filteredPartialBookingData.length > 0 ? (
          <Grid>
            {filteredPartialBookingData.map((data) => (
              <Grid.Col key={data.room_id} span={12} sm={6} md={4}>
                <Box
                  p="md"
                  style={{
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    backgroundColor: "#f8f9fa",
                  }}
                >
                  <Text weight={600} mb="xs" style={{ fontWeight: "bold" }}>
                    Room {data.room_number}
                  </Text>
                  <Text size="sm" color="dimmed" mb="xs">
                    Partial availability:
                  </Text>
                  {data.available_ranges.map((range, index) => (
                    <Box
                      key={index}
                      py="xs"
                      style={{
                        borderTop: index === 0 ? "none" : "1px solid #e0e0e0",
                      }}
                    >
                      <Button
                        variant="light"
                        color="blue"
                        style={{ marginTop: "5px", backgroundColor: "#E6F3FF" }}
                      >
                        From {new Date(range.from).toLocaleDateString()} to{" "}
                        {new Date(range.to).toLocaleDateString()}
                      </Button>
                    </Box>
                  ))}
                </Box>
              </Grid.Col>
            ))}
          </Grid>
        ) : (
          <Box
            p="md"
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              backgroundColor: "#f8f9fa",
            }}
          >
            <Text align="center" color="dimmed">
              No partial bookings available.
            </Text>
          </Box>
        )}
      </Box>
    </MantineProvider>
  );
}

RoomsDetails.propTypes = {
  bookingFrom: PropTypes.string.isRequired,
  bookingTo: PropTypes.string.isRequired,
};

export default RoomsDetails;
