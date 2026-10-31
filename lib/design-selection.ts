import { ROOM_TYPES, THEMES } from "@/lib/constants";
import { RoomType, Theme } from "@/types";

/**
 * Deep link into the design tool: `/generate?style=<theme>&room=<roomType>`.
 * Design pages build it with `generateHref`; the tool reads it back with
 * `readDesignSelection`, which drops any value that is not a known option.
 */

export interface DesignSelection {
    theme?: Theme;
    roomType?: RoomType;
}

const STYLE_PARAM = "style";
const ROOM_PARAM = "room";

function isTheme(value: string | null): value is Theme {
    return value !== null && Object.hasOwn(THEMES, value);
}

function isRoomType(value: string | null): value is RoomType {
    return value !== null && Object.hasOwn(ROOM_TYPES, value);
}

/** Values the tool does not offer are left out, so a link never carries a value the tool would ignore. */
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
    if (isTheme(theme)) selection.theme = theme;
    if (isRoomType(roomType)) selection.roomType = roomType;
    return selection;
}
