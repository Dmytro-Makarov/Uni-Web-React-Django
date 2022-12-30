import React, {useState, Component} from "react";
import {Link, useNavigate} from "react-router-dom"
import {Button, Grid, Typography, TextField, FormHelperText, FormControl, FormControlLabel, RadioGroup, Radio, Collapse} from "@mui/material";
import { Alert } from "@mui/lab"

CreateRoomPage.defaultProps = {
    votesToSkip: 2,
    guestCanPause: true,
    update: false,
    roomCode: null,
}

export default function CreateRoomPage(props) {
    const navigate = useNavigate();
    
    const[guestCanPause,setguestCanPause] = useState(props.guestCanPause);
    const[votesToSkip,setgvotesToSkip] = useState(props.votesToSkip);
    const[successMsg, setsuccessMsg] = useState("");
    const[errorMsg, seterrorMsg] = useState("");
  
    const handleVotesChange = () => {
        (event.target.value != "" && event.target.value != null) ? 
        setgvotesToSkip(event.target.value) : 
        setgvotesToSkip(votesToSkip);
    };
  
    const handleGuestCanPauseChange = () => {
      setguestCanPause(event.target.value === "true" ? true : false);
    };
  
    const handleRoomButtonPressed = () => {
      console.log('Room Create Post');
      const requestOptions = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          votes_to_skip: votesToSkip,
          guest_can_pause: guestCanPause,
        }),
      };
      console.log('Room Create Fetch');
      fetch("/api/create-room", requestOptions)
        .then((response) => response.json())
        .then((data) => navigate('/room/'+ data.code));
    };

    const handleUpdateButtonPressed = () => {
        console.log('Room Update Post');
        const requestOptions = {
          method: "PATCH",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            votes_to_skip: votesToSkip,
            guest_can_pause: guestCanPause,
            code: props.roomCode
          }),
        };
        console.log('Room Update Fetch');
        fetch("/api/update-room", requestOptions)
          .then((response) => {
            if (response.ok) {
                setsuccessMsg("Room updated successfully!")
            } else {
                seterrorMsg("Error updating room...")
            }
          });
      };

    const renderCreateButtons = () => {
        return (
        <Grid container spacing={1}>
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
        );
    } 

    const renderUpdateButtons = () => {
        return (
        <Grid item xs={12} align="center">
                <Button color="primary" variant="contained" onClick={handleUpdateButtonPressed}>
                    Update Room
                </Button>
        </Grid>
        );
    }

    const title = props.update ? "Update Room" : "Create a Room"

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Collapse in={errorMsg != "" || successMsg != ""}>
                    {successMsg != "" ? 
                    (<Alert severity="success" onClose={() => {setsuccessMsg("")}}>{successMsg}</Alert>) : 
                    (<Alert severity="error" onClose={() => {seterrorMsg("")}}>{errorMsg}</Alert>)}
                </Collapse>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography component='h4' variant='h4'>
                    {title}
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
                    defaultValue= {String(guestCanPause)} 
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
                </Grid>
                <Grid item xs={12} align="center">
                    <FormControl>
                        <TextField 
                        required={true} 
                        type="number" 
                        onChange={handleVotesChange}
                        default={props.votesToSkip} 
                        placeholder={votesToSkip}
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
                {props.update ? renderUpdateButtons() : renderCreateButtons()}
            </Grid>
        )
    }