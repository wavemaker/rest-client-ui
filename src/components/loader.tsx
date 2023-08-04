// ** MUI Imports 
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

const FallbackSpinner = () => {

    return (
        <Box className="loadingScreen cmnflx">
            <CircularProgress disableShrink sx={{ mt: 6 }} />
        </Box>
    )
}

export default FallbackSpinner
