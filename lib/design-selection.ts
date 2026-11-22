import { isRoomType, isTheme } from "@/lib/constants";
import { RoomType, Theme } from "@/types";

export interface DesignSelection {
    theme?: Theme;
    roomType?: RoomType;
}

const STYLE_PARAM = "style";
const ROOM_PARAM = "room";

export function generateHref({ theme, roomType }: { theme?: string; roomType?: string }): string {
    const params = new URLSearchParams();
    if (theme && isTheme(theme)) params.set(STYLE_PARAM, theme);
    if (roomType && isRoomType(roomType)) params.set(ROOM_PARAM, roomType);
    const query = params.toString();
    return query ? `/generate?${query}` : "/generate";
}

export function readDesignSelection(params: { get(name: string): string | null }): DesignSelection {
    const selection: DesignSelection = {};
    const theme = params.get(STYLE_PARAM);
    const roomType = params.get(ROOM_PARAM);
    if (theme && isTheme(theme)) selection.theme = theme;
    if (roomType && isRoomType(roomType)) selection.roomType = roomType;
    return selection;
}
