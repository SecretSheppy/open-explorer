const sys = new SystemData();
const controls = new Controls(sys);
const pinned = new Pinned(sys);

// loading default directory
sys.directoryHistory.push(new Explorer(sys.directory.default, sys));

// scanning for secondary and removable drives

// TODO - make file selector (via process.argv)
//  make folder selector (via process.argv)
//  -> both use process.stdout() to communicate results to where called
//  -> both should also have internal mode for OpenExplorer use (i.e. no stdout)