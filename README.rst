About the Sandbox
==================

This Git repository is a template for creating ZeOmega private sandbox
repositories.  You can fork it on GitHub to create your own sandbox,
but do not send back pull requests to this template sandbox.  The plan
is to keep this sandbox template empty, except for this one README file.


Important Advice
----------------

To make your life easier in using the Sandbox, after you fork,
make sure not to do any commits into the master branch.

You need an empty branch in order to create new empty branches.
"Empty" in this case means having very little history -- 
really only the history of this README file.

So, before doing any commits, checkout a new branch of the empty
master branch, like this::

    # assuming you are already in the empty master branch
    git checkout -b my_new_idea
    
From there, you can add any commits to the my_new_idea branch.

Later, when you want another branch, go back to the master
branch and create a new empty branch, like this::

    git checkout master
    git checkout -b another_new_idea


Why Does This Sandbox Repo Exist?
---------------------------------

The main reason for this Sandbox repo is to satisfy the need
when a ZeOmega developer needs a place to push code, but there
is no existing repo in GitHub matching the concept the developer
wants to create.

Of course, a developer can always just create a  Git repo
for any directory by typing "git init" inside the directory.
However, it's nice to have a place to push that code to a
server for purposes of backup, or where other developers can
see and interact.

Another alternative is to create a private Gist, which works
well if you only need to work with a single module::

    https://gist.github.com/
    
    
Use Case 1: Experimental Prototype
----------------------------------

For a throw-away prototype, the goal is to explore a problem you don't
understand by trying things out.  It might be pointless to 
document and write tests. Maybe you just want to try out something
quickly. 

A sandbox branch might be just the thing you need, though if
it is very small you could also use a Gist.


Use Case 2: Starting Real Development, Missing Repo
----------------------------------------------------

You might have a real project starting up with documented requirements,
but you don't yet have the repo you need to start work.

Later you know ZeOmega management will create the repo, but you
are ready to start and don't want to wait.

In this case, you should create a local Git repo and start development
right away. You might have several local branches. You should follow
all the best practices for building a new ZeOmega component, such
as writing tests, designing the public API, clean coding, etc.

When you're ready to share the code, or just want a backup of the
repo, you can push any branch up to your personal Sandbox fork.
Supposing the branch with the most important work is the "master"
branch, but you want to push it to a new branch in the Sandbox
called "my_new_component". Here's how::

    git checkout master
    git remote add sandbox git@github.com:my-github-id/sandbox.git
    git push sandbox master:my_new_component
    
This will add the 'my_new_component' branch to your personal
sandbox.

Later, suppose your new component has an official repo created
with the name "jiva.awesomeness". To move the sandbox branch
into the master branch of jiva.awesomeness, do the following::

    git clone git@github.com:zeomega/jiva.awesomeness.git
    git remote add sandbox git@github.com:my-github-id/sandbox.git
    git pull sandbox my_new_component
    git push origin master

