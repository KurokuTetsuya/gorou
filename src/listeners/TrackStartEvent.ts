import { Player, Track } from "erela.js";
import { BaseListener } from "../structures/BaseListener";
import { createEmbed } from "../utils/createEmbed";
import { DefineListener } from "../utils/decorators/DefineListener";

@DefineListener("trackStart", "erela")
export class TrackStartEvent extends BaseListener {
    public async execute(player: Player, track: Track): Promise<void> {
        const manager = this.client._music.fetch(player.guild);
        const channel = this.client.channels.cache.get(player.textChannel!);
        if (channel?.isText()) {
            const msg = await channel.send({
                embeds: [createEmbed("info", `▶ Start playing: **[${track.title}](${track.uri})**`).setThumbnail(track.thumbnail!)]
            });
            manager.oldMusicMessage = msg.id;
        }
    }
}
