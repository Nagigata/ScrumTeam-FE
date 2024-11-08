import { Box, useTheme, Typography, IconButton } from "@mui/material";
import { tokens } from "../../theme";

const StatBox = ({ title, subtitle, icon, increase }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box width="100%" m="0 30px">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={1}
      >
        <IconButton sx={{ width: "36px", height: "36px" }}>{icon}</IconButton>
        <Typography
          variant="h3"
          fontWeight="bold"
          sx={{
            color: colors.blueAccent[600],
            textAlign: "center",
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          sx={{
            color: colors.grey[100],
          }}
        >
          {subtitle}
        </Typography>
      </Box>
    </Box>
  );
};

export default StatBox;
