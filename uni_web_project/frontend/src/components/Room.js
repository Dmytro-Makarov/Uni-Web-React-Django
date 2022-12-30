import React, { useState } from "react";
import { useParams } from "react-router-dom";  
import { Grid, Button, Typography} from "@mui/material";
import {useNavigate} from 'react-router-dom';
import CreateRoomPage from './CreateRoomPage';

export default function Room(props) {
    const navigate = useNavigate();
    
    const[votesToSkip, setVotesToSkip] = useState(2);
    const[guestCanPause, setGuestCanPause] = useState(false);
    const[isHost, setIsHost] = useState(false);
    const[showSetting, setshowSettings] = useState(false);
    
    const { roomCode } = useParams();

    fetch('/api/get-room?code='+roomCode)
    .then((response) => {
        if(!response.ok) {
            props.leaveRoomCallback();
            navigate('/');
        }    
        return response.json()
    })
    .then((data) => {
        setVotesToSkip(data.votes_to_skip);
        setGuestCanPause(data.guest_can_pause);
        setIsHost(data.is_host);
    });
       
    const leaveButtonPressed = () => {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        };
    
        fetch("/api/leave-room", requestOptions)
          .then((response) => {
            //props.leaveRoomCallback();
            navigate('/');
          });
      };

    const updateShowSettings = (value) => {
        setshowSettings(value);
    }

    const renderSettings = () => {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <CreateRoomPage 
                    update={true} 
                    votesToSkip={votesToSkip} 
                    guestCanPause={guestCanPause} 
                    roomCode={roomCode}
                    updateCallback={() => {}}
                    />
                </Grid>
                <Grid item xs={12} align="center">
                    <Button 
                    variant="contained" 
                    color="secondary" 
                    onClick = {() => updateShowSettings(false)}>
                        Close
                    </Button>
                </Grid>
            </Grid>
        );
    }

    const renderSettingsButton = () => {
        return (
            <Grid item xs={12} align="center">
                <Button variant="contained" color="primary" onClick = {() => updateShowSettings(true)}>
                    Settings
                </Button>
            </Grid>
        );
    }

    if (showSetting) {
        return renderSettings();
    } 
    else {
        return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography variant="h4" component="h4">
                    Code : {roomCode}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h6" component="h6">
                    Votes : {votesToSkip}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h6" component="h6">
                    Guest Can Pause: {String(guestCanPause)}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h6" component="h6">
                    Host: {String(isHost)}
                </Typography>
            </Grid>
            {isHost ? renderSettingsButton() : null}
            <Grid item xs={12} align="center">
                <Button variant="contained" color="secondary" onClick={leaveButtonPressed}>
                    Leave Room
                </Button>
            </Grid>
        </Grid>
    )}
}