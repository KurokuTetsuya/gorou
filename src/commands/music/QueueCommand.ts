import { BaseCommand } from "../../structures/BaseCommand";
import { createEmbed } from "../../utils/createEmbed";
import { chunk } from "../../utils/chunk";
import { DefineCommand } from "../../utils/decorators/DefineCommand";
import { ButtonPagination } from "../../utils/ButtonPagination";
import { MessageEmbed } from "discord.js";
import { CommandContext } from "../../structures/CommandContext";

@DefineCommand({
    aliases: ["q"],
    cooldown: 3,
    description: "List of queued songs",
    name: "queue",
    slash: {
        options: []
    },
    usage: "{prefix}queue"
})
export class QueueCommand extends BaseCommand {
    public async execute(ctx: CommandContext): Promise<any> {
        if (ctx.isInteraction() && !ctx.deferred) await ctx.deferReply();
        const { music } = ctx.guild!;
        const queue = music.player?.queue ?? [];
        const pages = chunk(queue.map((x, i) => `**${++i}.** **[${x.title}](${x.uri!})** <@${String(x.requester)}>`), 10).map(x => x.join("\n"));
        const embed = createEmbed("info", pages[0] || "Empty, add some by using `play` command", false)
            .setAuthor(`${ctx.guild!.name} Queue`, ctx.guild!.iconURL({ dynamic: true, size: 4096 })!);
        const msg = await ctx.send({
            embeds: [embed],
            content: music.player?.queue.current ? `▶ **Now playing: __${music.player.queue.current.title}__**` : null
        }, "editReply");
        if (pages.length) embed.setFooter(`Page 1 of ${pages.length}.`);
        if (pages.length > 1) {
            const pagination = new ButtonPagination(msg, {
                content: music.player?.queue.current ? `▶ **Now playing: __${music.player.queue.current.title}__**` : "",
                pages, embed,
                edit: (i, emb, page): MessageEmbed => emb.setDescription(page).setFooter(`Page ${i + 1} of ${pages.length}`)
            });
            await pagination.start();
        }
    }
}
