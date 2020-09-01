import React, { FC, useState, useEffect } from 'react';
import { Snackbar, makeStyles, Typography, Grid } from '@material-ui/core';
import { Warning } from '@material-ui/icons';
import { useSelector } from 'react-redux';
import { RootState } from './Reducers';
import { SwitchBarListState } from './Components/Molecules/SwitchBarList/switchBarListSlice';

const useStyles = makeStyles(() => ({
    root: {
        background: 'red'
    }
}));

/** Show a Snackbar for new error messages */
const MessageProvider: FC = ({ children }) => {
    const classes = useStyles();
    const [isOpen, setIsOpen] = useState(true);
    const [message, setMessage] = useState('');
    const handleClose = (): void => setIsOpen(false);
    const isLoading = useSelector<RootState, SwitchBarListState['isLoading']>(
        (state: RootState) => state.switchesListNew.isLoading
    );
    useEffect(() => {
        setMessage('is aan het laden...');
        setIsOpen(true);
    }, [isLoading]);
    return (
        <>
            {children}
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                autoHideDuration={3000}
                message={
                    <Grid container direction="row" alignItems="center">
                        <Grid item>
                            <Warning />
                        </Grid>
                        <Grid item style={{ marginLeft: '1rem' }}>
                            {message} <span onClick={handleClose}>close</span>
                        </Grid>
                    </Grid>
                }
                open={isOpen}
                onClose={handleClose}
                ContentProps={{
                    classes: {
                        root: classes.root
                    }
                }}
            />
        </>
    );
};

export default MessageProvider;
