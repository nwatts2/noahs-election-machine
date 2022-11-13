class Candidate {
    constructor(fname, lname, party, incumbent, hasElection, state, favorite, rating, held, ratingRank, vote, percent, firstRoundVote, firstRoundPercent, runoffVote, runoffPercent, type) {
      this.fname = fname;
      this.lname = lname;
      this.party = party.toUpperCase();
      this.incumbent = incumbent;
      this.hasElection = hasElection;
      this.state = state.toUpperCase();
      this.favorite = favorite;
      this.rating = rating;
      this.held = held.toUpperCase();
      this.ratingRank = ratingRank;
  
      this.vote = vote;
      this.percent = percent;
      this.firstRoundVote = firstRoundVote;
      this.firstRoundPercent = firstRoundPercent;
      this.runoffVote = runoffVote;
      this.runoffPercent = runoffPercent;
  
      this.type = type;
      
      this.called = false;
      this.bg = 'grey';
      this.color = 'grey';
  
      if (this.incumbent && !this.hasElection) {
        this.called = true;
      }
  
      if (this.party === 'R') {this.color = 'rgb(253, 3, 83)'}
      else if (this.party === 'D') {this.color = 'rgb(0, 71, 255)'}
      else {this.color = 'rgb(27, 174, 83)'}
  
      if (Math.abs(this.ratingRank) === 3) {this.bg = `linear-gradient(to right, ${this.color} 75%, transparent)`; }
      else if (Math.abs(this.ratingRank) === 2) {this.bg = `linear-gradient(to right, ${this.color}, transparent 100%)`; }
      else if (Math.abs(this.ratingRank) === 1) {this.bg = `linear-gradient(to right, ${this.color}, transparent 60%)`; }
      else if (this.ratingRank === 0) {this.bg = `linear-gradient(to right, ${this.color}, transparent 20%)`; }
      else if (Math.abs(this.ratingRank) == 4) {this.bg = this.color;}
    }
  }