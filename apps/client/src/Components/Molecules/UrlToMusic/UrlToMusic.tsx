import { Card, CardContent } from "@mui/material";
import { FC } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../Reducers";
import GetInfoForm from "./GetInfoForm";
import GetMusicForm from "./GetMusicForm";
import GetSearchForm from "./GetSearchForm";
import { UrlToMusicState } from "./urlToMusicSlice";

const UrlToMusic: FC = () => {
    const { showGetMusicForm } = useSelector<RootState, UrlToMusicState>(
        (state: RootState) => state.urlToMusic
    );

    return (
        <Card>
            <CardContent>
                <GetSearchForm />
                <GetInfoForm />
                {showGetMusicForm && <GetMusicForm />}
            </CardContent>
        </Card>
    );
};

export default UrlToMusic;
