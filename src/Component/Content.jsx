import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CardMedia from '@mui/material/CardMedia';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import APIService from "../APIService/APIService";
import { withStyles } from "@material-ui/styles";
const theme = createTheme();
const CssTextField = withStyles({
    root: {
        '& label.Mui-focused': {
            color: 'white',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: 'white',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: 'white',
            },
            '&:hover fieldset': {
                borderColor: 'blue',
            },
            '&.Mui-focused fieldset': {
                borderColor: 'white',
            },
        },
    },
})(TextField);

export const Content = () => {
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [url, setUrl] = useState('');
    const [duration, setDuration] = useState(0);
    const [backgroundContent, setBackgroundContent] = useState('');
    const [content, setContent] = useState([]);
    const [indexState, setIndexState] = useState(1);
    const [newContent, setNewContent] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const apiService = new APIService();
    // hem yeni içerik eklendiğinde hem de başlangıçta var olan tüm içeriklerin gelmesi için useEffect oluşturuldu
    // hem de setTimeout metoduyla birlikte her içeriğin süresi kadar arka planın resminin kalması için useEffect oluşturuldu.
    useEffect(() => {
        if (content.length > 0) {
            setBackgroundContent(content[indexState].url);
            const timeoutSet = setTimeout(() => {
                if (indexState < content.length - 1) {
                    setIndexState(indexState + 1);
                }
                else {
                    setIndexState(0)
                }
            }, content[indexState].duration * 1000);
            return () => clearTimeout(timeoutSet);
        }
    }, [content, indexState]);
    useEffect(() => {
        apiService.getContent().then(response => {
            setContent(response.data);
            console.log('playlist', response.data);
        });
    }, [newContent]);
    const saveContent = async (e) => {
        e.preventDefault();
        await apiService.postContent(name, type, url, duration).then(response => {
            if (response.status === 200) {
                setNewContent(true);
            }
            else {
                console.log(response.data)
                setAlertMessage(response.data.message);
            }
        });
    }
    return (
        <ThemeProvider theme={theme}>
            {content.length > 0 && backgroundContent.includes('mp4') &&
                <CardMedia
                    style={{
                        width: '100vw',
                        height: '100vh',
                        objectFit: 'cover',
                        position: 'fixed',
                        top: 0,
                        left: 0,
                    }}
                    component='video'
                    image={backgroundContent}
                    autoPlay
                />
                // </Grid>
            }
            {content.length > 0 && content.type !== 'video' &&
                <CardMedia
                    style={{
                        width: '100vw',
                        height: '100vh',
                        objectFit: 'cover',
                        position: 'fixed',
                        top: 0,
                        left: 0,
                    }}
                    component='img'
                    image={backgroundContent}
                    autoPlay
                />
            }
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                {content.length > 0 && content.type !== 'video' &&
                    <Grid
                        item
                        xs={4}
                        sm={4}
                        md={7}
                        sx={{
                            backgroundImage: `url(${backgroundContent})`,
                            backgroundRepeat: 'no-repeat',
                            backgroundColor: (t) =>
                                t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                    </Grid>
                }
                <Grid item xs={8} sm={8} md={5} component={Paper} elevation={6} square>

                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        {alertMessage &&
                            <Stack sx={{ width: '100%' }} spacing={2}>
                                <Alert variant="filled" severity="error">{alertMessage}</Alert>
                            </Stack>
                        }
                        <Box component="form" noValidate onSubmit={saveContent} sx={{ mt: 1 }}>
                            <CssTextField
                                margin="normal"
                                required
                                fullWidth
                                id="name"
                                label="Name"
                                name="name"
                                autoFocus
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                sx={{ input: { color: 'white' }, label: { color: 'white' } }}
                            />
                            <CssTextField
                                margin="normal"
                                required
                                fullWidth
                                id="type"
                                label="Type"
                                name="type"
                                autoFocus
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                sx={{ input: { color: 'white' }, label: { color: 'white' } }}
                            />
                            <CssTextField
                                margin="normal"
                                required
                                fullWidth
                                id="url"
                                label="Url"
                                name="url"
                                autoFocus
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                sx={{ input: { color: 'white' }, label: { color: 'white' } }}
                            /> <CssTextField
                                margin="normal"
                                type="number"
                                required
                                fullWidth
                                id="duration"
                                label="Duration"
                                name="duration"
                                autoFocus
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                sx={{ input: { color: 'white' }, label: { color: 'white' } }}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                onClick={saveContent}
                            >
                                Save Content
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>

    );
}
export default Content;