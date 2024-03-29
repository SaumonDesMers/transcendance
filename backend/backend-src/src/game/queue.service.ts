import { Injectable } from "@nestjs/common";
import { PlayerEntity } from "./player.entity";

@Injectable()
export class QueueService {

	playerInQueue = new WeakMap<PlayerEntity, { type: string, uid: string }>();
	queues = {
		'NORMAL': new Array<PlayerEntity>(),
		'CUSTOM': new Array<PlayerEntity>(),
	};
	queueUnique = new Map<string, { type: string, playerWaiting: PlayerEntity }>();

	log() {
		console.log('queue.service: log: NORMAL:', this.queues.NORMAL.map(p => { return { id: p.id, state: p.state.value } }));
		console.log('queue.service: log: CUSTOM:', this.queues.CUSTOM.map(p => { return { id: p.id, state: p.state.value } }));
		// console.log('queue.service: log: queueUnique:', this.queueUnique);
		// console.log('queue.service: log: playerInQueue:', this.playerInQueue);
	}

	//###########################################################################################################
	//#                                                                                                         #
	//#                                        CLASSIC AND CUSTOM QUEUE                                         #
	//#                                                                                                         #
	//###########################################################################################################


	async join(player: PlayerEntity, type: string): Promise<null | { p1: PlayerEntity, p2: PlayerEntity }> {

		if (this.playerInQueue.has(player)) {
			this.leaveCurrentQueue(player);
		}

		player.state.set('queue', type);
		this.playerInQueue.set(player, { type, uid: 'default' });

		this.queues[type].push(player);

		return this.checkQueueForPlayers(type);
	}

	async leave(player: PlayerEntity) {
		const state = this.playerInQueue.get(player);
		if (state == undefined) {
			console.log('queue.service: leave: player not in queue');
			return;
		}
		
		player.state.set('none', '');
		this.leaveCurrentQueue(player);
	}

	private checkQueueForPlayers(type: string): { p1: PlayerEntity, p2: PlayerEntity } | null {
		if (this.queues[type].length < 2)
			return null;

		let p1 = this.queues[type].shift();
		let p2 = this.queues[type].shift();

		this.playerInQueue.delete(p1);
		this.playerInQueue.delete(p2);

		return { p1, p2 };
	}


	//###########################################################################################################
	//#                                                                                                         #
	//#                                             UNIQUE QUEUE                                                #
	//#                                                                                                         #
	//###########################################################################################################


	async createUniqueQueue(player: PlayerEntity, type: string, uid: string) {
		
		if (this.playerInQueue.has(player)) {
			this.leaveCurrentQueue(player);
		}

		player.state.set('queue', 'UNIQUE');
		this.playerInQueue.set(player, { type: 'UNIQUE', uid });

		this.queueUnique.set(uid, { type, playerWaiting: player });
	}

	async joinUniqueQueue(player: PlayerEntity, uid: string): Promise<null | { p1: PlayerEntity, p2: PlayerEntity, type: string }> {

		if (!this.queueUnique.has(uid)) {
			console.log('queue.service: joinUniqueQueue: queueUnique does not have uid:', uid);
			return null;
		}

		const { type, playerWaiting } = this.queueUnique.get(uid);

		if (playerWaiting == player) {
			console.log('queue.service: joinUniqueQueue: player cannot join his own queue');
			return null;
		}

		if (this.playerInQueue.has(player)) {
			this.leaveCurrentQueue(player);
		}

		this.queueUnique.delete(uid);
		this.playerInQueue.delete(playerWaiting);

		return {
			p1: playerWaiting,
			p2: player,
			type,
		};
	}

	async leaveUniqueQueue(player: PlayerEntity) {
		if (!this.playerInQueue.has(player)) {
			console.log('queue.service: leaveUniqueQueue: player not in queue');
			return;
		}

		player.state.set('none', '');
		this.leaveCurrentQueue(player);
	}


	//###########################################################################################################
	//#                                                                                                         #
	//#                                               GENERAL                                                   #
	//#                                                                                                         #
	//###########################################################################################################

	
	leaveCurrentQueue(player: PlayerEntity) {

		if (!this.playerInQueue.has(player)) {
			console.log('queue.service: leaveCurrentQueue: player not in queue');
			return;
		}

		const state = this.playerInQueue.get(player);
		console.log('queue.service: leaveCurrentQueue: user.state:', state);

		if (state.type == 'NORMAL' || state.type == 'CUSTOM') {

			this.queues[state.type] = this.queues[state.type].filter((p: PlayerEntity) => p != player);

		} else if (state.type == 'UNIQUE') {

			if (!this.queueUnique.has(state.uid)) {
				console.log('queue.service: leaveCurrentQueue: queueUnique does not have uid:', state.uid);
				return;
			}

			this.queueUnique.delete(state.uid);
		}
		this.playerInQueue.delete(player);
	}
}