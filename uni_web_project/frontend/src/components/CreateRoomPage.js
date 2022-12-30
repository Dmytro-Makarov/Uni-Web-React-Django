import React, {useState, Component} from "react";
import {Link} from "react-router-dom"
import {Button, Grid, Typography, TextField, FormHelperText, FormControl, FormControlLabel, RadioGroup, Radio} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function CreateRoomPage(props) {
    const navigate = useNavigate();
    
    const[defaultVotes,setdefaultVotes] = useState(2);
    const[guestCanPause,setguestCanPause] = useState(true);
    const[votesToSkip,setgvotesToSkip] = useState(defaultVotes);
  
    const handleVotesChange = () => {
      setgvotesToSkip(event.target.value);
    };
  
    const handleGuestCanPauseChange = () => {
      setguestCanPause(event.target.value === "true" ? true : false);
    };
  
    const handleRoomButtonPressed = () => {
      console.log('TEST');
      const requestOptions = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          votes_to_skip: votesToSkip,
          guest_can_pause: guestCanPause,
        }),
      };
      console.log('TEST2');
      fetch("/api/create-room", requestOptions)
        .then((response) => response.json())
        .then((data) => navigate('/room/'+ data.code));
    };

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography component='h4' variant='h4'>
                    Create A Room
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl component="fieldset">
                    <FormHelperText>
                        <div align = 'center'>
                            Guest Control of Playback State
                        </div>
                    </FormHelperText>
                    <RadioGroup 
                    row 
                    defaultValue='true' 
                    onChange={handleGuestCanPauseChange}
                    >
                        <FormControlLabel 
                            value="true" 
                            control={<Radio color="primary"/>} 
                            label="Play/Pause"
                            labelPlacement="bottom"
                        />
                        <FormControlLabel 
                            value="false" 
                            control={<Radio color="secondary"/>} 
                            label="No Control"
                            labelPlacement="bottom"
                        />
                    </RadioGroup>
                </FormControl>
                <Grid item xs={12} align="center">
                    <FormControl>
                        <TextField 
                        required={true} 
                        type="number" 
                        onChange={handleVotesChange}
                        default={defaultVotes} 
                        inputProps={{ 
                            min: 1,
                            style: {textAlign: "center"}
                            }}
                        />
                        <FormHelperText>
                            <div align="center">
                                Votes Required To Skip Song
                            </div>
                        </FormHelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="primary" variant="contained" onClick={handleRoomButtonPressed}>
                         Create A Room
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="secondary" variant="contained" to ="/" component={Link}>
                        Back
                    </Button>
                </Grid>
            </Grid>
        </Grid>
        )
    }